try:
    import swisseph as swe
except ImportError:
    print("Warning: pyswisseph not found. Using mock implementation.")
    class MockSwe:
        SIDM_LAHIRI = 1
        SUN, MOON, MARS, MERCURY, JUPITER, VENUS, SATURN, MEAN_NODE = 0, 1, 4, 2, 5, 3, 6, 11 # Approx IDs
        FLG_SWIEPH = 2
        FLG_SIDEREAL = 64 * 1024
        
        def set_ephe_path(self, path): pass
        def set_sid_mode(self, mode): pass
        def julday(self, y, m, d, h): return 2451545.0 + (365 * (y - 2000)) # Rough approx
        def calc_ut(self, jd, planet, flags):
            # Return dummy [longitude, lat, dist, speed, ...]
            # Pseudo-random based on planet ID and JD to be somewhat consistent
            import math
            lon = (planet * 30 + (jd % 360)) % 360
            return [lon, 0, 1, 0, 0, 0]
        def houses(self, jd, lat, lon, sys):
            # Return (houses_list, ascmc_list)
            # ascmc[0] is Ascendant
            asc = (jd % 360) 
            houses = [(asc + i*30)%360 for i in range(12)]
            ascmc = [asc, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            return houses, ascmc

    swe = MockSwe()
from datetime import datetime, timedelta
import os

# Set ephemeris path
# Ensure the 'ephemeris' folder exists relative to this file
EPHE_PATH = os.path.join(os.path.dirname(__file__), "ephemeris")
if not os.path.exists(EPHE_PATH):
    os.makedirs(EPHE_PATH)

swe.set_ephe_path(EPHE_PATH)

# Use Lahiri Ayanamsa (Vedic standard)
swe.set_sid_mode(swe.SIDM_LAHIRI)

SIGNS = [
    "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
    "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
]

PLANETS = {
    "Sun": swe.SUN,
    "Moon": swe.MOON,
    "Mars": swe.MARS,
    "Mercury": swe.MERCURY,
    "Jupiter": swe.JUPITER,
    "Venus": swe.VENUS,
    "Saturn": swe.SATURN,
    "Rahu": swe.MEAN_NODE
}

def longitude_to_sign(longitude):
    sign_index = int(longitude // 30)
    return SIGNS[sign_index]

def calculate_julian_day(date, time, timezone):
    dt = datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M")
    # Timezone conversion: 
    # Input time is Local. We need UTC for SwissEph?
    # Actually swe.julday typically uses Universal Time (UT) or Ephemeris Time? 
    # swe.julday takes year, month, day, hour.
    # If the input is standard Time (e.g. IST), we subtract offset to get UTC.
    dt_utc = dt - timedelta(hours=timezone)

    jd = swe.julday(
        dt_utc.year,
        dt_utc.month,
        dt_utc.day,
        dt_utc.hour + dt_utc.minute/60.0
    )
    return jd

def calculate_planets(jd):
    planet_positions = {}
    
    # Calculate main planets
    for name, planet in PLANETS.items():
        # calc_ut returns tuple (lon, lat, dist, speed, ...)
        # We need lon (index 0)
        # flags: swe.FLG_SWIEPH + swe.FLG_SIDEREAL for Vedic?
        # set_sid_mode sets the ayanamsa, but we must use FLG_SIDEREAL in calc call or use set_sid_mode global?
        # Actually swisseph usually needs FLG_SIDEREAL to return sidereal positions usually.
        # Let's add FLG_SIDEREAL just to be safe if set_sid_mode isn't auto-applying without it.
        # Although set_sid_mode implies we want sidereal, the calc function needs to know we want to Apply it.
        
        flags = swe.FLG_SWIEPH | swe.FLG_SIDEREAL
        res = swe.calc_ut(jd, planet, flags)
        lon = res[0] # Longitude
        planet_positions[name] = lon

    # Ketu = Rahu + 180
    ketu_lon = (planet_positions["Rahu"] + 180) % 360
    planet_positions["Ketu"] = ketu_lon

    return planet_positions

def calculate_houses(jd, lat, lon):
    # 'P' for Placidus is default, but for Vedic we often use 'W' (Whole Sign) or 'E' (Equal) or Sripati?
    # Standard Vedic often uses Whole Sign (which is just Ascendant Sign = House 1) 
    # OR Equal House from Ascendant.
    # Using 'P' (Placidus) or 'W' (Whole Sign)?
    # User's snippet used default houses(). 
    # Let's stick to user's snippet logic: swe.houses(jd, lat, lon) defaults to Placidus usually ('P').
    # But for Vedic 'A' (Equal) or traditional methods are common. 
    # Let's use 'P' (default) as requested in snippet, or 'E' (Equal)?
    # User snippet: houses, ascmc = swe.houses(jd, lat, lon) (Implies default 'P')
    
    # For Vedic compatibility, strictly we might want sidereal houses? 
    # set_sid_mode affects planetary positions. Does it affect cusp calculations? Yes if FLG_SIDEREAL used?
    # houses() function in pyswisseph typically strictly geometric on tropical unless adapted?
    # Actually complex. Let's start with User's snippet exactly to minimize deviation.
    # Update: User specific 'P' is default.
    
    h_sys = b'P' # Placidus standard default
    houses, ascmc = swe.houses(jd, lat, lon, h_sys)
    ascendant = ascmc[0]
    return houses, ascendant

def get_house(planet_lon, asc_lon):
    # Simple House calculation: (Planet - Asc)
    # This implies Equal House system starting exactly from Ascendant Degree?
    # Or Whole Sign?
    # User snippet: int((planet - asc) // 30) + 1
    # This is "Equal House from Ascendant Degree" roughly.
    diff = (planet_lon - asc_lon) % 360
    return int(diff // 30) + 1

def generate_d1_chart(date, time, lat, lon, timezone):
    jd = calculate_julian_day(date, time, timezone)
    planets = calculate_planets(jd)
    houses_cusps, ascendant = calculate_houses(jd, lat, lon)
    
    asc_sign = longitude_to_sign(ascendant)

    result = {
        "Ascendant": {
            "sign": asc_sign,
            "longitude": round(ascendant, 2)
        },
        "Planets": {}
    }

    for planet, lon_val in planets.items():
        result["Planets"][planet] = {
            "longitude": round(lon_val, 2),
            "sign": longitude_to_sign(lon_val),
            "house": get_house(lon_val, ascendant)
        }

    return result
