# Breadboard Layout Editor

This project is a grid-based breadboard layout editor for reconstructing a circuit as an abstract plan, similar to a LEGO instruction diagram. It does not use the source photo as an overlay or recognition target.

## Board Model

- The board has 20 columns and 17 rows.
- Columns are labeled `A` through `T`.
- Rows are labeled `1` through `17`.
- Columns are grouped into four horizontal blocks:
  - Block 1: `A-E`
  - Block 2: `F-J`
  - Block 3: `K-O`
  - Block 4: `P-T`
- Within each block, holes in the same row are internally connected:
  - `A1-B1-C1-D1-E1`
  - `F1-G1-H1-I1-J1`
  - `K1-L1-M1-N1-O1`
  - `P1-Q1-R1-S1-T1`
- Gaps between blocks are not internally connected.
- Components and jumper endpoints must snap to breadboard holes.
- The UI should show abstract node connectivity by default.

## Component Model

Components are template-based. Users should place and move fixed templates rather than freely authoring arbitrary component geometry.

Known component categories:

- Battery positive lead: 1 pin
- Battery negative lead: 1 pin
- Jumper wire: 2 endpoints, any holes
- Resistor: 2 endpoints, any holes, drawn like a jumper with a resistor body
- Diode: 2 endpoints, any holes, directional
- LED: 2 pins in a vertical line
- Buzzer: 2 pins across an adjacent block gap only
- Transistor: 3 pins in a vertical line
- Switch: 3 pins in a vertical line
- Potentiometer: 3 pins in a vertical line with one empty row between pins
- Cylindrical capacitor: 2 pins in a vertical line
- Small chip-like capacitor: 2 pins in a vertical line with row delta 3

## Confirmed IC

The central inverter is a `CD4069UBE` 14-pin DIP package.

Placement, with the package notch marker facing south:

```text
J6  = pin 8   4Y        K6  = pin 7   VSS
J7  = pin 9   4A        K7  = pin 6   3Y
J8  = pin 10  5Y        K8  = pin 5   3A
J9  = pin 11  5A        K9  = pin 4   2Y
J10 = pin 12  6Y        K10 = pin 3   2A
J11 = pin 13  6A        K11 = pin 2   1Y
J12 = pin 14  VDD       K12 = pin 1   1A
```

## Current Circuit Assumptions

- `SW1` off is state `A`, connecting `T15-T16`.
- `SW1` on is state `B`, connecting `T16-T17` and tying `BAT-1` to the circuit `VSS` rail.
- `BZ1` is polarized with `+` on `J2` and `-` on `K2`.
- `Q1` is modeled as a PNP high-side transistor: `E` is on `VDD`, `C` feeds `BZ1+`, and `B` is driven by `U1.3Y`.
- `C1` is polarized with `+` on the `U1.1A` timing node and `-` on `VSS`.
- `C2` is treated as a non-polarized timing capacitor. If the physical part is polarized, use `M10` as `+` and `M13` as `-`.
- `D1` is drawn with anode at `L11` and cathode at `L10`, matching the slow-decay/sawtooth shaping model.
- `LED1` is drawn with anode on `VDD` and cathode toward `R1/VSS`.

## Running The App

Run the local save server:

```sh
python3 server.py 4174
```

Then open `http://127.0.0.1:4174/index.html` in a browser.

The app loads `layout.json` on startup. Every edit autosaves back to `layout.json` through the local server. If the app is opened without `server.py`, it can still use browser fallback storage, but it cannot write `layout.json`.

## Abstract Simulation

The simulator is a behavioral model, not a SPICE-grade analog solver.

- `POT1` controls the buzzer pulse/modulation rate.
- `POT2` controls the buzzer tone frequency.
- `D1` in the sawtooth direction changes the simulated carrier from square to sawtooth.
- `SW1` must be on, state `B`, for the circuit to be treated as powered.
- The browser uses a low-volume square wave to approximate the buzzer sound.
