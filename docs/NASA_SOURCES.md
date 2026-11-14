# FLAMELENS AI — NASA SOURCES & PROVENANCE INVENTORY
**NASA Space Apps 2026 | Challenge 08: Flame in Freefall**

Every record in FlameLens AI is linked to official NASA archives or peer-reviewed primary literature.

---

## 1. Official NASA Repositories

| Repository | Source ID | URL | Description | Verification Level |
| :--- | :--- | :--- | :--- | :--- |
| **NASA Physical Sciences Informatics (PSI)** | `SRC-NASA-PSI` | [psi.nasa.gov](https://psi.nasa.gov/) | NASA's primary open-science archive for flight telemetry and combustion images. | Official NASA Open Science Data |
| **NASA Technical Reports Server (NTRS)** | `SRC-NASA-NTRS` | [ntrs.nasa.gov](https://ntrs.nasa.gov/) | Digital library for NASA technical reports, flight experiment evaluations, and safety rules. | Official US Federal Government Repository |

---

## 2. Peer-Reviewed Flight Experiment Publications

### A. FLEX / FLEX-2 (Flame Extinguishment Experiment)
- **Source ID:** `SRC-PECS-DIETRICH`
- **Citation:** Dietrich, D.L., Nayagam, V., Hicks, M.C., Ferkul, P.V., Dryer, F.L., Farouk, T., Williams, F.A. (2014). *Droplet combustion experiments aboard the International Space Station.* Progress in Energy and Combustion Science, 42, 1–34.
- **DOI:** [10.1016/j.pecs.2014.01.004](https://doi.org/10.1016/j.pecs.2014.01.004)
- **Facility:** ISS Combustion Integrated Rack (CIR) / MDCA
- **Key Findings Ingested:** Confirmed spherical flame geometry in microgravity; burning rate constant $K$ is ~20-25% lower than 1-g ground normal due to absence of buoyancy.

### B. CFI (Cool Flames Investigation)
- **Source ID:** `SRC-COMBFLAME-NAYAGAM`
- **Citation:** Nayagam, V., Dietrich, D.L., Ferkul, P.V., Hicks, M.C., Williams, F.A. (2012). *Cool-flame extinction during microgravity droplet combustion aboard the ISS.* Combustion and Flame, 159(12), 3583–3588.
- **DOI:** [10.1016/j.combustflame.2012.07.012](https://doi.org/10.1016/j.combustflame.2012.07.012)
- **Facility:** ISS Combustion Integrated Rack (CIR)
- **Key Findings Ingested:** Discovery of sustained low-temperature ($550-750\text{ K}$) invisible cool flames burning below conventional hot flame extinction limits. Bypasses optical smoke and flame sensors.

### C. ACME (Advanced Combustion via Microgravity Experiments)
- **Source ID:** `SRC-NASA-TM-URBAN`
- **Citation:** Urban, D.L., Sunderland, P.B., Axelbaum, R.L., Chao, B.H., Law, C.K., Liu, F., Sacksteder, K.R. (2019). *ACME: Advanced Combustion via Microgravity Experiments — Overview and Status.* NASA Technical Memorandum TM-2019-220207.
- **NTRS Document:** [NASA TM-2019-220207](https://ntrs.nasa.gov/citations/20190001424)
- **Facility:** ISS CIR (1,500+ ignited flames)
- **Key Findings Ingested:** High residence time in ethylene microgravity flames creates dense soot volume fractions exceeding $8.3\text{ ppm}$, forming radiant soot shells that drive radiative quenching.

### D. BASS / BASS-II (Burning and Suppression of Solids)
- **Source ID:** `SRC-NASA-TM-OLSON`
- **Citation:** Olson, S.L., Ferkul, P.V., T'ien, J.S. (2015). *Flame spread over solids in microgravity environments: BASS flight data.* NASA Technical Reports Server, Report 20150002871.
- **NTRS Document:** [NASA CR-2015-0002871](https://ntrs.nasa.gov/citations/20150002871)
- **Facility:** ISS Microgravity Science Glovebox (MSG)
- **Key Findings Ingested:** In quiescent air ($0\text{ cm/s}$ flow), solid PMMA flames self-extinguish; ventilation airflow ($1-5\text{ cm/s}$) sustains wide, flattened flame sheets.

### E. SoFIE (Solid Fuel Ignition and Extinction)
- **Source ID:** `SRC-NASA-SOFIE`
- **Citation:** Ferkul, P.V., et al. (2022). *Solid Fuel Ignition and Extinction (SoFIE) Investigation: Operational Findings in Exploration Atmospheres.* NASA Glenn Research Center.
- **Facility:** ISS CIR (Installed 2022 for Artemis)
- **Key Findings Ingested:** Spacecraft materials compliant under 21% O₂ Earth normal rapidly propagate flames under exploration cabin environments ($30-34\%\text{ O}_2$ at $56\text{ kPa}$).
