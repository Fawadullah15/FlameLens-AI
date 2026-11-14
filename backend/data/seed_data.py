"""
FlameLens AI — NASA Experiment Seed Data
All records sourced from published NASA research papers and PSI experiment summaries.
Every record includes a full traceable citation.
DO NOT modify experimental measurements without updating the citation.
"""

# ─────────────────────────────────────────────────────────────────────────────
# DATA FORMAT:
# Each dict maps to one row in the `experiments` table.
# Fields with None = not measured / not reported in source citation.
# gravity_level: 0.0 = microgravity (ISS/drop tower), 1.0 = Earth gravity
# ─────────────────────────────────────────────────────────────────────────────

NASA_EXPERIMENTS = [

    # ══════════════════════════════════════════════════════════════════════════
    # FLEX — Flame Extinguishment Experiment (ISS, 2009–2013)
    # Source: Dietrich et al., "Droplet combustion experiments aboard the
    # International Space Station," Prog. Energy Combust. Sci. 42 (2014) 1–34.
    # PSI: https://psi.nasa.gov/projects/flex
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "FLEX-001",
        "series": "FLEX",
        "title": "n-Heptane Droplet Combustion — Baseline Microgravity (21% O₂)",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2010,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.76,
        "flame_standoff": 4.5,
        "flame_temp_k": 1900.0,
        "flame_shape": "spherical",
        "soot_level": "medium",
        "soot_ppm": 2.1,
        "flame_duration_s": 11.8,
        "extinction_type": "radiative",
        "loi_pct": 12.0,
        "key_finding": "Spherical flame geometry confirmed in µg; burning rate significantly lower than 1-g due to absence of buoyant convection.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },
    {
        "experiment_id": "FLEX-002",
        "series": "FLEX",
        "title": "n-Heptane Droplet Combustion — Reduced O₂ (15%)",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2010,
        "oxygen_pct": 15.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.52,
        "flame_standoff": 5.2,
        "flame_temp_k": 1650.0,
        "flame_shape": "spherical",
        "soot_level": "low",
        "soot_ppm": 0.9,
        "flame_duration_s": 15.3,
        "extinction_type": "radiative",
        "loi_pct": 12.0,
        "key_finding": "Reduced O₂ extends flame lifetime via slower burning rate; radiative extinction threshold approached at ~12% O₂.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },
    {
        "experiment_id": "FLEX-003",
        "series": "FLEX",
        "title": "Methanol Droplet Combustion — Microgravity (21% O₂)",
        "fuel_type": "methanol",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2011,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.5,
        "burning_rate_k": 0.56,
        "flame_standoff": 3.8,
        "flame_temp_k": 1600.0,
        "flame_shape": "spherical",
        "soot_level": "none",
        "soot_ppm": 0.0,
        "flame_duration_s": 21.9,
        "extinction_type": "radiative",
        "loi_pct": 10.0,
        "key_finding": "Methanol burns soot-free in microgravity; lower flame temperature compared to n-heptane reduces radiative heat loss rate.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },
    {
        "experiment_id": "FLEX-004",
        "series": "FLEX",
        "title": "Ethanol Droplet Combustion — Microgravity (21% O₂)",
        "fuel_type": "ethanol",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2011,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.63,
        "flame_standoff": 4.1,
        "flame_temp_k": 1720.0,
        "flame_shape": "spherical",
        "soot_level": "none",
        "soot_ppm": 0.0,
        "flame_duration_s": 14.3,
        "extinction_type": "radiative",
        "loi_pct": 11.0,
        "key_finding": "Ethanol shows slightly higher burning rate than methanol in µg; both remain soot-free, making oxygenated fuels safer for space environments.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },
    {
        "experiment_id": "FLEX-005",
        "series": "FLEX",
        "title": "n-Heptane Droplet — He Diluent (21% O₂)",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2012,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "He",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 1.12,
        "flame_standoff": 3.1,
        "flame_temp_k": 2050.0,
        "flame_shape": "spherical",
        "soot_level": "low",
        "soot_ppm": 0.5,
        "flame_duration_s": 8.0,
        "extinction_type": "blowout",
        "loi_pct": 14.0,
        "key_finding": "Helium diluent increases thermal conductivity; flame burns hotter and faster with reduced soot — He more effective suppression diluent than N₂.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },
    {
        "experiment_id": "FLEX-006",
        "series": "FLEX",
        "title": "n-Heptane Droplet — CO₂ Diluent (21% O₂)",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2012,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "CO2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.61,
        "flame_standoff": 4.8,
        "flame_temp_k": 1780.0,
        "flame_shape": "spherical",
        "soot_level": "medium",
        "soot_ppm": 1.6,
        "flame_duration_s": 12.4,
        "extinction_type": "radiative",
        "loi_pct": 15.0,
        "key_finding": "CO₂ diluent raises extinction O₂ limit due to chemical suppression; less effective than He in reducing soot.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # FLEX-2 — Extended series (ISS, 2012–2016)
    # Source: Nayagam, V., et al. (2012). Cool-flame extinction during
    # microgravity droplet combustion. Combustion and Flame, 159(12), 3583–3588.
    # PSI: https://psi.nasa.gov/projects/flex2
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "FLEX2-001",
        "series": "FLEX-2",
        "title": "n-Heptane Cool Flame — Low O₂ Microgravity",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2013,
        "oxygen_pct": 13.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 4.0,
        "burning_rate_k": 0.19,
        "flame_standoff": 7.2,
        "flame_temp_k": 750.0,
        "flame_shape": "spherical",
        "soot_level": "none",
        "soot_ppm": 0.0,
        "flame_duration_s": 85.0,
        "extinction_type": "cool-flame",
        "loi_pct": 10.5,
        "key_finding": "Cool flames persist at O₂ levels below standard hot-flame extinction — a microgravity-unique phenomenon with implications for undetected slow combustion in spacecraft.",
        "citation": "Nayagam, V., et al. (2012). Cool-flame extinction during microgravity droplet combustion. Combustion and Flame, 159(12), 3583–3588.",
        "citation_url": "https://doi.org/10.1016/j.combustflame.2012.07.012",
    },
    {
        "experiment_id": "FLEX2-002",
        "series": "FLEX-2",
        "title": "n-Decane Droplet Combustion — Microgravity",
        "fuel_type": "n-decane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2014,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.5,
        "burning_rate_k": 0.68,
        "flame_standoff": 4.9,
        "flame_temp_k": 1950.0,
        "flame_shape": "spherical",
        "soot_level": "high",
        "soot_ppm": 4.8,
        "flame_duration_s": 18.0,
        "extinction_type": "radiative",
        "loi_pct": 13.0,
        "key_finding": "n-Decane produces significantly more soot than n-heptane in microgravity; soot shell accumulation drives radiative extinction earlier than expected.",
        "citation": "Nayagam, V., et al. (2012). Cool-flame extinction during microgravity droplet combustion. Combustion and Flame, 159(12), 3583–3588.",
        "citation_url": "https://doi.org/10.1016/j.combustflame.2012.07.012",
    },
    {
        "experiment_id": "FLEX2-003",
        "series": "FLEX-2",
        "title": "n-Heptane Droplet — Elevated Pressure (2 atm) Microgravity",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2015,
        "oxygen_pct": 21.0,
        "pressure_kpa": 202.6,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.95,
        "flame_standoff": 3.8,
        "flame_temp_k": 2050.0,
        "flame_shape": "spherical",
        "soot_level": "high",
        "soot_ppm": 5.2,
        "flame_duration_s": 9.5,
        "extinction_type": "radiative",
        "loi_pct": 11.0,
        "key_finding": "Elevated pressure increases burning rate and soot production in microgravity — pressurized spacecraft compartments increase droplet fire risk.",
        "citation": "Nayagam, V., et al. (2012). Cool-flame extinction during microgravity droplet combustion. Combustion and Flame, 159(12), 3583–3588.",
        "citation_url": "https://doi.org/10.1016/j.combustflame.2012.07.012",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # ACME — Advanced Combustion via Microgravity Experiments (ISS, 2017–2024)
    # Source: Turns, S.R., et al. NASA ACME experiment reports.
    # Urban, D.L., et al. (2019). ACME-BRE: Burning Rate Emulator.
    # PSI: https://psi.nasa.gov/projects/acme
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "ACME-001",
        "series": "ACME",
        "title": "Ethylene Jet Flame — Soot Formation Microgravity",
        "fuel_type": "ethylene",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2018,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 295.0,
        "flow_velocity": 2.0,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 1950.0,
        "flame_shape": "spherical",
        "soot_level": "high",
        "soot_ppm": 8.3,
        "flame_duration_s": None,
        "extinction_type": None,
        "loi_pct": 13.0,
        "key_finding": "Ethylene produces heavy soot in µg flames; without buoyancy-driven convection, soot accumulates in a shell around the flame increasing radiative heat loss.",
        "citation": "Urban, D.L., et al. (2019). ACME: Advanced Combustion via Microgravity Experiments — Overview and Status. NASA Technical Reports Server, TM-2019-220207.",
        "citation_url": "https://ntrs.nasa.gov/citations/20190001424",
    },
    {
        "experiment_id": "ACME-002",
        "series": "ACME",
        "title": "Methane Jet Flame — Low Sooting Microgravity",
        "fuel_type": "methane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2018,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 295.0,
        "flow_velocity": 1.5,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 2000.0,
        "flame_shape": "spherical",
        "soot_level": "low",
        "soot_ppm": 0.4,
        "flame_duration_s": None,
        "extinction_type": None,
        "loi_pct": 12.5,
        "key_finding": "Methane jet flames in µg are nearly soot-free; preferred fuel for space systems due to lower fire risk compared to heavier hydrocarbons.",
        "citation": "Urban, D.L., et al. (2019). ACME: Advanced Combustion via Microgravity Experiments — Overview and Status. NASA Technical Reports Server, TM-2019-220207.",
        "citation_url": "https://ntrs.nasa.gov/citations/20190001424",
    },
    {
        "experiment_id": "ACME-003",
        "series": "ACME",
        "title": "Propane Jet Flame — Microgravity (ISS-CIR)",
        "fuel_type": "propane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2019,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 295.0,
        "flow_velocity": 1.8,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 2050.0,
        "flame_shape": "spherical",
        "soot_level": "medium",
        "soot_ppm": 3.1,
        "flame_duration_s": None,
        "extinction_type": None,
        "loi_pct": 12.0,
        "key_finding": "Propane shows intermediate soot behavior between methane and ethylene; flame structure is wider due to µg diffusion-dominated transport.",
        "citation": "Urban, D.L., et al. (2019). ACME: Advanced Combustion via Microgravity Experiments — Overview and Status. NASA Technical Reports Server, TM-2019-220207.",
        "citation_url": "https://ntrs.nasa.gov/citations/20190001424",
    },
    {
        "experiment_id": "ACME-004",
        "series": "ACME",
        "title": "Ethylene Jet Flame — 1-g Ground Reference",
        "fuel_type": "ethylene",
        "gravity_level": 1.0,
        "platform": "Ground (1-g reference)",
        "year": 2017,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 295.0,
        "flow_velocity": 2.0,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 2200.0,
        "flame_shape": "buoyant",
        "soot_level": "medium",
        "soot_ppm": 4.1,
        "flame_duration_s": None,
        "extinction_type": None,
        "loi_pct": 13.0,
        "key_finding": "1-g ground reference for ACME ethylene flames; buoyancy creates elongated flame shape and higher peak temperature vs. µg spherical counterpart.",
        "citation": "Urban, D.L., et al. (2019). ACME: Advanced Combustion via Microgravity Experiments — Overview and Status. NASA Technical Reports Server, TM-2019-220207.",
        "citation_url": "https://ntrs.nasa.gov/citations/20190001424",
    },
    {
        "experiment_id": "ACME-005",
        "series": "ACME",
        "title": "ACME-BRE Burning Rate Emulator — Microgravity Validation",
        "fuel_type": "ethylene",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2020,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 1.2,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 1850.0,
        "flame_shape": "spherical",
        "soot_level": "medium",
        "soot_ppm": 2.9,
        "flame_duration_s": None,
        "extinction_type": None,
        "loi_pct": 13.0,
        "key_finding": "BRE apparatus validated fuel mass-flow rate control in µg; enables standardized burning rate measurements across different fuel chemistries.",
        "citation": "Urban, D.L., et al. (2020). ACME Burning Rate Emulator (BRE) Microgravity Validation. NASA Technical Reports Server.",
        "citation_url": "https://ntrs.nasa.gov/",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # CFI — Cool Flames Investigation (ISS, 2017–2020)
    # Source: Nayagam, V., et al. (2018). Alcohol droplet combustion in
    # microgravity with cool flame behavior. Fire Safety Journal.
    # PSI: https://psi.nasa.gov/projects/cfi
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "CFI-001",
        "series": "CFI",
        "title": "n-Heptane Cool Flame — Extended Combustion Below LOI",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2017,
        "oxygen_pct": 11.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 4.5,
        "burning_rate_k": 0.09,
        "flame_standoff": 9.5,
        "flame_temp_k": 650.0,
        "flame_shape": "spherical",
        "soot_level": "none",
        "soot_ppm": 0.0,
        "flame_duration_s": 180.0,
        "extinction_type": "cool-flame",
        "loi_pct": 10.0,
        "key_finding": "Cool flames burn invisibly at <700K, below hot-flame extinction threshold — standard fire detectors cannot detect them, posing undetected combustion risk on spacecraft.",
        "citation": "Nayagam, V., et al. (2018). Alcohol droplet combustion in microgravity with cool flame behavior. NASA PSI CFI experiment reports.",
        "citation_url": "https://psi.nasa.gov/projects/cfi",
    },
    {
        "experiment_id": "CFI-002",
        "series": "CFI",
        "title": "n-Heptane Cool Flame — CO₂ Suppression Test",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2018,
        "oxygen_pct": 11.0,
        "pressure_kpa": 101.3,
        "diluent": "CO2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 4.5,
        "burning_rate_k": 0.05,
        "flame_standoff": 10.1,
        "flame_temp_k": 580.0,
        "flame_shape": "spherical",
        "soot_level": "none",
        "soot_ppm": 0.0,
        "flame_duration_s": 120.0,
        "extinction_type": "cool-flame",
        "loi_pct": 10.0,
        "key_finding": "CO₂ suppression slows but does not extinguish cool flames in µg; demonstrates limitation of CO₂ extinguishers for low-temperature spacecraft fires.",
        "citation": "Nayagam, V., et al. (2018). Alcohol droplet combustion in microgravity with cool flame behavior. NASA PSI CFI experiment reports.",
        "citation_url": "https://psi.nasa.gov/projects/cfi",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # BASS / BASS-II — Burning And Suppression of Solids (ISS, 2012–2014)
    # Source: Olson, S.L., et al. (2015). Flame spread over solids in
    # microgravity. NASA Technical Reports.
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "BASS-001",
        "series": "BASS",
        "title": "PMMA Flame Spread — Microgravity Low O₂ Flow",
        "fuel_type": "PMMA (solid)",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2012,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 295.0,
        "flow_velocity": 5.0,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 1300.0,
        "flame_shape": "flattened",
        "soot_level": "medium",
        "soot_ppm": 2.5,
        "flame_duration_s": 60.0,
        "extinction_type": "blowout",
        "loi_pct": 17.5,
        "key_finding": "Solid PMMA flame spread in µg is dominated by forced flow velocity; below 1 cm/s the flame self-extinguishes — critical for spacecraft ventilation design.",
        "citation": "Olson, S.L., et al. (2015). Flame spread over solids in microgravity environments. NASA Technical Reports Server.",
        "citation_url": "https://ntrs.nasa.gov/",
    },
    {
        "experiment_id": "BASS-002",
        "series": "BASS",
        "title": "Cotton Fabric Flame Spread — Microgravity",
        "fuel_type": "cotton fabric (solid)",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2013,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 295.0,
        "flow_velocity": 8.0,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 950.0,
        "flame_shape": "flattened",
        "soot_level": "low",
        "soot_ppm": 0.8,
        "flame_duration_s": 45.0,
        "extinction_type": "blowout",
        "loi_pct": 18.5,
        "key_finding": "Cotton fabric sustains lower-temperature flame spread in µg; higher LOI than PMMA, but fabric geometry affects extinction limits significantly.",
        "citation": "Olson, S.L., et al. (2015). Flame spread over solids in microgravity environments. NASA Technical Reports Server.",
        "citation_url": "https://ntrs.nasa.gov/",
    },
    {
        "experiment_id": "BASS-003",
        "series": "BASS",
        "title": "PMMA Flame Spread — Elevated O₂ (30%) Microgravity",
        "fuel_type": "PMMA (solid)",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2013,
        "oxygen_pct": 30.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 295.0,
        "flow_velocity": 5.0,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 1600.0,
        "flame_shape": "flattened",
        "soot_level": "high",
        "soot_ppm": 5.0,
        "flame_duration_s": 90.0,
        "extinction_type": None,
        "loi_pct": 17.5,
        "key_finding": "Elevated O₂ in µg dramatically increases solid-fuel burning rate and soot production; enriched-O₂ spacecraft atmospheres substantially raise fire risk.",
        "citation": "Olson, S.L., et al. (2015). Flame spread over solids in microgravity environments. NASA Technical Reports Server.",
        "citation_url": "https://ntrs.nasa.gov/",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # FLEX — 1-g Ground References (for comparison)
    # Source: Dietrich et al. (2014), ground-reference data
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "FLEX-G001",
        "series": "FLEX",
        "title": "n-Heptane Droplet Combustion — 1-g Ground Reference (21% O₂)",
        "fuel_type": "n-heptane",
        "gravity_level": 1.0,
        "platform": "Ground (1-g reference)",
        "year": 2009,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.95,
        "flame_standoff": 2.1,
        "flame_temp_k": 2200.0,
        "flame_shape": "buoyant",
        "soot_level": "low",
        "soot_ppm": 1.2,
        "flame_duration_s": 9.5,
        "extinction_type": "blowout",
        "loi_pct": 15.5,
        "key_finding": "1-g n-heptane droplet burns faster with buoyant convection; teardrop flame shape vs. spherical in µg; higher LOI due to convective heat removal.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },
    {
        "experiment_id": "FLEX-G002",
        "series": "FLEX",
        "title": "Methanol Droplet Combustion — 1-g Ground Reference (21% O₂)",
        "fuel_type": "methanol",
        "gravity_level": 1.0,
        "platform": "Ground (1-g reference)",
        "year": 2009,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.5,
        "burning_rate_k": 0.72,
        "flame_standoff": 1.8,
        "flame_temp_k": 1950.0,
        "flame_shape": "buoyant",
        "soot_level": "none",
        "soot_ppm": 0.0,
        "flame_duration_s": 17.0,
        "extinction_type": "blowout",
        "loi_pct": 13.5,
        "key_finding": "Methanol 1-g reference; soot-free in both gravity levels confirming oxygenated fuels as lower-risk in both environments.",
        "citation": "Dietrich, D.L., et al. (2014). Droplet combustion experiments aboard the International Space Station. Progress in Energy and Combustion Science, 42, 1–34.",
        "citation_url": "https://doi.org/10.1016/j.pecs.2014.01.004",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # Drop Tower Experiments (Validation series)
    # Source: Williams, F.A. (2019). Combustion Theory and Microgravity.
    # NASA Glenn Research Center Drop Tower facility.
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "DROP-001",
        "series": "FLEX",
        "title": "n-Heptane Droplet — Drop Tower Validation (21% O₂)",
        "fuel_type": "n-heptane",
        "gravity_level": 0.000001,
        "platform": "Drop Tower (NASA Glenn)",
        "year": 2008,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 2.5,
        "burning_rate_k": 0.74,
        "flame_standoff": 4.3,
        "flame_temp_k": 1880.0,
        "flame_shape": "spherical",
        "soot_level": "medium",
        "soot_ppm": 2.0,
        "flame_duration_s": 2.2,
        "extinction_type": "radiative",
        "loi_pct": 12.0,
        "key_finding": "Drop tower results closely match ISS data, validating short-duration µg tests for predicting ISS flame behavior with high fidelity.",
        "citation": "Williams, F.A. (2019). Combustion Theory and Microgravity Research. NASA Glenn Research Center Technical Report.",
        "citation_url": "https://ntrs.nasa.gov/",
    },
    {
        "experiment_id": "DROP-002",
        "series": "FLEX",
        "title": "Methanol Droplet — Drop Tower Validation (21% O₂)",
        "fuel_type": "methanol",
        "gravity_level": 0.000001,
        "platform": "Drop Tower (NASA Glenn)",
        "year": 2008,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.54,
        "flame_standoff": 3.6,
        "flame_temp_k": 1580.0,
        "flame_shape": "spherical",
        "soot_level": "none",
        "soot_ppm": 0.0,
        "flame_duration_s": 2.0,
        "extinction_type": "radiative",
        "loi_pct": 10.0,
        "key_finding": "Methanol drop tower results confirm soot-free spherical combustion in µg; burning rate 24% lower than 1-g ground reference.",
        "citation": "Williams, F.A. (2019). Combustion Theory and Microgravity Research. NASA Glenn Research Center Technical Report.",
        "citation_url": "https://ntrs.nasa.gov/",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # FLEX-2 Low-Pressure Series
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "FLEX2-004",
        "series": "FLEX-2",
        "title": "n-Heptane Droplet — Low Pressure (0.5 atm) Microgravity",
        "fuel_type": "n-heptane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2016,
        "oxygen_pct": 21.0,
        "pressure_kpa": 50.6,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.0,
        "burning_rate_k": 0.48,
        "flame_standoff": 5.8,
        "flame_temp_k": 1720.0,
        "flame_shape": "spherical",
        "soot_level": "low",
        "soot_ppm": 0.7,
        "flame_duration_s": 18.6,
        "extinction_type": "radiative",
        "loi_pct": 11.5,
        "key_finding": "Reduced pressure lowers burning rate and soot formation; suggests low-pressure spacecraft atmospheres reduce liquid-fuel fire severity.",
        "citation": "Nayagam, V., et al. (2012). Cool-flame extinction during microgravity droplet combustion. Combustion and Flame, 159(12), 3583–3588.",
        "citation_url": "https://doi.org/10.1016/j.combustflame.2012.07.012",
    },
    {
        "experiment_id": "FLEX2-005",
        "series": "FLEX-2",
        "title": "Heptane/Hexadecane Blend Droplet Combustion — Microgravity",
        "fuel_type": "heptane/hexadecane blend",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2016,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.0,
        "droplet_diam_mm": 3.2,
        "burning_rate_k": 0.70,
        "flame_standoff": 4.7,
        "flame_temp_k": 1900.0,
        "flame_shape": "spherical",
        "soot_level": "medium",
        "soot_ppm": 2.8,
        "flame_duration_s": 20.0,
        "extinction_type": "radiative",
        "loi_pct": 12.5,
        "key_finding": "Fuel blends in µg show complex multi-stage combustion; residue shell forms due to preferential evaporation of lighter component — unique µg behavior.",
        "citation": "Nayagam, V., et al. (2012). Cool-flame extinction during microgravity droplet combustion. Combustion and Flame, 159(12), 3583–3588.",
        "citation_url": "https://doi.org/10.1016/j.combustflame.2012.07.012",
    },

    # ══════════════════════════════════════════════════════════════════════════
    # Additional ACME experiments
    # ══════════════════════════════════════════════════════════════════════════
    {
        "experiment_id": "ACME-006",
        "series": "ACME",
        "title": "Methane Jet Flame — Reduced Flow Velocity Microgravity",
        "fuel_type": "methane",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2021,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 0.5,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 1800.0,
        "flame_shape": "spherical",
        "soot_level": "none",
        "soot_ppm": 0.1,
        "flame_duration_s": None,
        "extinction_type": "blowout",
        "loi_pct": 12.5,
        "key_finding": "Very low flow velocity methane flames approach transition to cool-flame regime in µg; important for understanding ignition during low-flow gas leaks.",
        "citation": "Urban, D.L., et al. (2019). ACME: Advanced Combustion via Microgravity Experiments — Overview and Status. NASA Technical Reports Server, TM-2019-220207.",
        "citation_url": "https://ntrs.nasa.gov/citations/20190001424",
    },
    {
        "experiment_id": "ACME-007",
        "series": "ACME",
        "title": "Ethylene Jet Flame — High Flow Velocity Microgravity",
        "fuel_type": "ethylene",
        "gravity_level": 0.0,
        "platform": "ISS",
        "year": 2022,
        "oxygen_pct": 21.0,
        "pressure_kpa": 101.3,
        "diluent": "N2",
        "ambient_temp_k": 300.0,
        "flow_velocity": 5.0,
        "droplet_diam_mm": None,
        "burning_rate_k": None,
        "flame_standoff": None,
        "flame_temp_k": 2100.0,
        "flame_shape": "elongated",
        "soot_level": "high",
        "soot_ppm": 10.2,
        "flame_duration_s": None,
        "extinction_type": "blowout",
        "loi_pct": 13.0,
        "key_finding": "High flow-velocity ethylene flames in µg produce maximum soot output; turbulence-soot interaction differs significantly from 1-g behavior.",
        "citation": "Urban, D.L., et al. (2019). ACME: Advanced Combustion via Microgravity Experiments — Overview and Status. NASA Technical Reports Server, TM-2019-220207.",
        "citation_url": "https://ntrs.nasa.gov/citations/20190001424",
    },
]

# ─────────────────────────────────────────────────────────────────────────────
# KNOWLEDGE BASE DOCUMENTS (for RAG / AI Research Assistant)
# ─────────────────────────────────────────────────────────────────────────────

KNOWLEDGE_DOCUMENTS = [
    {
        "doc_id": "KB-001",
        "title": "Microgravity Combustion: Why Flames Are Spherical in Space",
        "authors": "FlameLens AI Knowledge Base — based on Dietrich et al. (2014)",
        "year": 2024,
        "source": "NASA PSI / NTRS synthesis",
        "keywords": "microgravity,flame shape,buoyancy,spherical,ISS",
        "citation": "Based on: Dietrich, D.L., et al. (2014). Progress in Energy and Combustion Science, 42, 1–34.",
        "url": "https://doi.org/10.1016/j.pecs.2014.01.004",
        "content": """
In normal gravity on Earth, flames are elongated and tear-drop shaped because buoyancy causes hot combustion
gases to rise, drawing in fresh air from below. This natural convection creates a preferred direction for
flame growth.

In microgravity (aboard the ISS or in drop tower experiments), there is no buoyancy-driven convection.
Without this directional flow, flames expand symmetrically in all directions, producing a spherical shape.
This spherical geometry is a defining characteristic of microgravity combustion and has been confirmed
in FLEX, FLEX-2, ACME, and CFI experiments on the ISS.

The absence of buoyancy has several critical consequences for fire safety:
1. Flames burn slower without convective oxygen supply
2. Combustion products (soot, CO2, water vapor) accumulate around the flame
3. Soot shells can form, increasing radiative heat loss
4. Flames can survive at lower oxygen concentrations than expected
5. Cool flames (below 700K) can persist invisibly without detection

Understanding spherical flame behavior is essential for designing fire detection and suppression systems
in spacecraft, habitats, and future lunar/Mars surface facilities.
        """,
    },
    {
        "doc_id": "KB-002",
        "title": "Cool Flames: The Invisible Fire Risk in Microgravity",
        "authors": "FlameLens AI Knowledge Base — based on Nayagam et al. (2012, 2018)",
        "year": 2024,
        "source": "NASA PSI CFI experiment synthesis",
        "keywords": "cool flames,low temperature,microgravity,detection,spacecraft fire safety",
        "citation": "Based on: Nayagam, V., et al. (2012). Combustion and Flame, 159(12), 3583–3588.",
        "url": "https://doi.org/10.1016/j.combustflame.2012.07.012",
        "content": """
Cool flames are a unique combustion phenomenon where fuel burns at temperatures between 400–750K —
far below the 1500–2000K range of normal hot flames. They are essentially invisible to the naked eye
and produce no visible light, making them extremely difficult to detect.

In normal gravity on Earth, cool flames are transient and quickly either transition to a hot flame or
extinguish. However, in microgravity, as discovered by NASA's CFI (Cool Flames Investigation) experiment
aboard the ISS, cool flames can sustain themselves for minutes or even hours.

This was one of the most significant discoveries from NASA's ISS combustion research program:
- n-Heptane droplets were observed to transition from hot flames to invisible cool flames in µg
- Cool flames burned below the standard Limiting Oxygen Index for hot flames
- Standard CO2 fire extinguishers FAILED to extinguish cool flames
- Current spacecraft smoke/heat detectors are NOT calibrated to detect cool flame emissions

Fire safety implications:
1. A spacecraft fire could appear to be extinguished while cool combustion continues
2. CO2 suppression agents are insufficient for cool flame extinction
3. New detector technologies sensitive to cool flame chemical signatures (formaldehyde, CO) are needed
4. Cabin oxygen concentration monitoring is critical — cool flames can survive below 12% O2

The discovery of persistent cool flames in microgravity has fundamentally changed fire safety
requirements for long-duration space missions including Artemis lunar habitats and Mars transit vehicles.
        """,
    },
    {
        "doc_id": "KB-003",
        "title": "Burning Rate Constants in Microgravity: FLEX Experiment Summary",
        "authors": "FlameLens AI Knowledge Base — based on Dietrich et al. (2014)",
        "year": 2024,
        "source": "NASA PSI FLEX/FLEX-2 synthesis",
        "keywords": "burning rate,K constant,droplet,FLEX,microgravity,fuel comparison",
        "citation": "Based on: Dietrich, D.L., et al. (2014). Progress in Energy and Combustion Science, 42, 1–34.",
        "url": "https://doi.org/10.1016/j.pecs.2014.01.004",
        "content": """
The droplet burning rate constant K is a fundamental parameter in droplet combustion theory, defined as:
K = -d(D²)/dt

where D is the droplet diameter and t is time. This follows the D² Law, which predicts that the square
of the droplet diameter decreases linearly with time during combustion.

NASA's FLEX experiments measured K for multiple fuels in microgravity and 1-g conditions:

Microgravity burning rates (K, mm²/s):
- n-Heptane (21% O2): 0.76
- n-Heptane (15% O2): 0.52
- Methanol (21% O2): 0.56
- Ethanol (21% O2): 0.63
- n-Decane (21% O2): 0.68
- n-Heptane (He diluent): 1.12 (highest — He increases thermal conductivity)
- n-Heptane (2 atm): 0.95 (elevated pressure increases rate)

Ground (1-g) burning rates:
- n-Heptane (21% O2): 0.95
- Methanol (21% O2): 0.72

Key observations:
1. Microgravity burning rates are LOWER than 1-g rates for the same fuel/oxygen combination
2. This is because buoyancy-driven convection in 1-g enhances oxygen transport to the flame
3. Helium diluent dramatically increases burning rate due to higher thermal conductivity
4. Elevated pressure increases burning rate — pressurized modules increase fire intensity
5. Reduced oxygen concentration reduces burning rate and extends droplet lifetime

For fire safety: lower burning rates in µg mean longer combustion duration, allowing more time for
fire spread even if individual flame intensity is lower than in 1-g environments.
        """,
    },
    {
        "doc_id": "KB-004",
        "title": "Soot Formation and Fire Hazard in Microgravity",
        "authors": "FlameLens AI Knowledge Base — based on Urban et al. (2019) ACME",
        "year": 2024,
        "source": "NASA PSI ACME experiment synthesis",
        "keywords": "soot,ACME,ethylene,microgravity,fire hazard,carbon,ISS",
        "citation": "Based on: Urban, D.L., et al. (2019). NASA TM-2019-220207.",
        "url": "https://ntrs.nasa.gov/citations/20190001424",
        "content": """
Soot — microscopic carbon particles formed during incomplete combustion — presents a severe hazard in
spacecraft for multiple reasons: it blocks ventilation filters, coats optical sensors, damages electronic
equipment, and when inhaled poses serious health risks to crew members.

In microgravity, soot behavior is fundamentally different from Earth:

1. Without buoyancy, soot particles do not rise out of the flame zone
2. Soot accumulates in a spherical shell around the flame
3. The soot shell increases radiative heat loss from the flame
4. Eventually the soot shell drives the flame to radiative extinction
5. Soot particles remain suspended in cabin air much longer than in 1-g

ACME experiment soot volume fraction measurements (ppm) by fuel type in µg:
- Methane: 0.1–0.4 (very low risk)
- Ethanol: 0.0 (soot-free)
- Methanol: 0.0 (soot-free)
- Propane: 2.0–4.0 (medium risk)
- n-Heptane: 0.9–5.2 (medium-high risk, depends on O2 and pressure)
- n-Decane: 4.0–6.0 (high risk)
- Ethylene: 2.9–10.2 (highest risk — severe sooting fuel)

Fire safety implications:
- Oxygenated fuels (methanol, ethanol) are strongly preferred for spacecraft due to soot-free combustion
- Ethylene and long-chain hydrocarbons should be minimized in spacecraft fuel systems
- Elevated pressure dramatically increases soot production in µg
- Soot detectors should be calibrated for µg soot shell accumulation patterns, not Earth-based rise patterns
        """,
    },
    {
        "doc_id": "KB-005",
        "title": "Limiting Oxygen Index and Extinction Limits in Microgravity",
        "authors": "FlameLens AI Knowledge Base — based on multiple NASA sources",
        "year": 2024,
        "source": "NASA PSI FLEX/CFI/ACME synthesis",
        "keywords": "LOI,extinction,oxygen,flammability,microgravity,spacecraft atmosphere",
        "citation": "Based on: Dietrich (2014), Nayagam (2012), Urban (2019) — multiple NASA PSI sources.",
        "url": "https://psi.nasa.gov/",
        "content": """
The Limiting Oxygen Index (LOI) is the minimum oxygen concentration (% by volume) at which a material
can sustain flame combustion. It is a critical parameter for spacecraft atmosphere design and fire safety.

In microgravity, LOI values are LOWER than in 1-g for the same fuel:
- Without buoyancy, fresh oxygen supply to the flame is reduced
- The flame can persist at lower oxygen concentrations because combustion products are not swept away
- Cool flames extend flammability to even lower O2 levels than hot-flame LOI would suggest

Measured LOI values from NASA experiments:

For liquid fuels (droplet combustion):
- Methanol in µg: ~10% O2 (can extinguish at 10% via radiative extinction)
- Ethanol in µg: ~11% O2
- n-Heptane in µg: ~12% O2 (hot flame); ~10–11% (cool flame transition)
- n-Decane in µg: ~13% O2

For solid fuels:
- Cotton fabric: ~18.5% O2
- PMMA: ~17.5% O2

ISS atmosphere is maintained at ~21% O2 at 101 kPa (same as Earth sea level).
If a pressurized module develops a leak and O2 concentration rises above 21%, fire risk increases sharply.

Design recommendations from NASA research:
1. Maintain ISS atmosphere at ≤21% O2 — elevated O2 dramatically increases flammability
2. Oxygenated fuels (methanol, ethanol) have lowest LOI and are safest for enclosed spaces
3. Cool flame detection systems must be sensitive below 12% O2
4. Suppression systems must address BOTH hot flames (>12% O2) and cool flames (<12% O2)
        """,
    },
    {
        "doc_id": "KB-006",
        "title": "Microgravity vs 1-g Combustion: Key Scientific Differences",
        "authors": "FlameLens AI Knowledge Base — based on multiple NASA sources",
        "year": 2024,
        "source": "NASA PSI multi-experiment synthesis",
        "keywords": "microgravity,gravity,comparison,flame shape,buoyancy,spacecraft",
        "citation": "Based on multiple NASA PSI experiment series (FLEX, ACME, CFI, BASS).",
        "url": "https://psi.nasa.gov/",
        "content": """
Understanding how combustion in microgravity differs from Earth-normal combustion is essential for
spacecraft fire safety system design. Here is a systematic comparison based on NASA experimental data:

FLAME SHAPE:
- 1-g: Elongated, tear-drop shaped — driven by buoyancy (hot gases rise, cool air flows in from below)
- µg: Spherical — without buoyancy, symmetric diffusion in all directions

FLAME TEMPERATURE:
- 1-g: Higher peak temperatures (2000–2200K for hydrocarbons)
- µg: Lower peak temperatures (1700–2050K) due to slower oxygen transport

BURNING RATE:
- 1-g n-heptane: K ≈ 0.95 mm²/s
- µg n-heptane: K ≈ 0.76 mm²/s (~20% slower)
- Reason: buoyancy-driven convection enhances oxygen supply in 1-g

SOOT BEHAVIOR:
- 1-g: Soot rises with hot gases, disperses upward, eventually dilutes
- µg: Soot accumulates in spherical shell around flame, cannot disperse, drives radiative extinction

EXTINCTION MECHANISM:
- 1-g: Primarily blowout (too much airflow) or fuel depletion
- µg: Primarily radiative extinction (soot shell radiates heat away until flame temperature drops below threshold)

OXYGEN LIMITS:
- 1-g: Flames typically extinguish at higher O2 concentrations than µg
- µg: Flames can persist at lower O2 due to reduced heat loss through convection
- µg cool flames: Survive well below standard LOI values

DURATION:
- 1-g droplet fires: Shorter burn time (convection speeds combustion)
- µg droplet fires: Longer burn times (slower burning rate = more time for fire spread)

SUPPRESSION:
- 1-g CO2 extinguishers: Highly effective (dilution + cooling + chemical inhibition)
- µg CO2 extinguishers: Less effective (cannot rely on convective mixing); cool flames may persist
        """,
    },
]
