# Open Questions

This file records what is not yet known about the current physical circuit and which temporary defaults the editor should use until the real details are identified.

## Placement Status

The current abstract placement is stored in `layout.json`. Coordinates are now known for the battery leads, buzzer, transistor, resistor, diode, LED, switch, two potentiometers, two capacitors, and jumper wires.

Remaining validation work is about physical identity and orientation: part numbers, polarity marks, transistor pinout, and exact component values.

## Transistor Unknowns

Known:

- It has 3 pins.
- The pins should be represented as a vertical line, such as `C1-C2-C3`.
- Its visible shape is roughly round on the left side and elongated on the right side.

Still physically unknown:

- The exact transistor part number.
- The manufacturer pinout for the exact physical package.

Current inferred model:

- Treat `Q1` as a PNP high-side BJT.
- Keep pins top-to-bottom as `C`, `B`, `E`.
- In the current layout, `E` is on `VDD`, `C` feeds `BZ1+`, and `B` is driven from `U1.3Y`.
- This matches the intended behavior: a low output from `U1.3Y` turns the buzzer on.

## Switch Unknowns

Known:

- It has 3 pins.
- The pins should be represented as a vertical line, such as `C1-C2-C3`.

Still physically unknown:

- The exact switch type.
- Whether it is SPDT, momentary, slide, toggle, or another switch type.

Current inferred model:

- Label pins top-to-bottom as `A`, `COM`, `B`.
- Model it as a selectable 3-pin switch where `COM` connects either to `A` or to `B`.
- State `A` is off and connects `T15-T16`.
- State `B` is on and connects `T16-T17`, so `BAT-1` connects to the circuit `VSS` rail.

## Potentiometer Unknowns

Known:

- There are two potentiometers.
- Each has 3 pins.
- The pins have one empty row between them, such as `C1-C3-C5`.
- Each potentiometer should have a knob value.

Still physically unknown:

- The exact role of each potentiometer.
- The exact pin order.
- Which pin is the wiper.
- The default knob values.

Current inferred model:

- Label the two instances `POT1` and `POT2`.
- Label pins top-to-bottom as `A`, `W`, `B`, where `W` is the wiper.
- Set the default knob value to `50%`.
- Treat them as timing resistances that change the RC behavior feeding the CD4069 stages.

## Buzzer Unknowns

Known:

- It has 2 pins.
- It must span exactly one adjacent block gap.
- Valid column pairs are `E-F`, `J-K`, and `O-P`.
- Both pins must be on the same row.

Still physically unknown:

- Whether it should be rendered as active polarity-sensitive or passive polarity-neutral.

Current inferred model:

- `BZ1+` is at `J2`; `BZ1-` is at `K2`.
- `BZ1+` is fed by `Q1.C`; `BZ1-` returns to `VSS`.

## Resistor Unknowns

Known:

- It has 2 endpoints.
- It can connect any two holes, like a jumper wire.
- It should be drawn as a span with a resistor body.

Still physically unknown:

- The resistor value.

Current inferred model:

- `R1` spans `J16-K16`.
- Its value is still unknown.

## Diode And LED Unknowns

Diode known:

- It has 2 endpoints.
- It can connect any two holes, like a jumper wire.
- It is directional.

Diode still physically unknown:

- Its exact part number.

LED known:

- It has 2 pins in a vertical line.

LED still physically unknown:

- Its color.

Current inferred model:

- `D1` is anode at `L11` and cathode at `L10`.
- This direction matches the hint that the diode slows one side of the decay path and changes the waveform toward a sawtooth.
- `LED1` is anode at `H17` on `VDD` and cathode at `H16` toward `R1/VSS`.

## Capacitor Unknowns

Known:

- There are two visual capacitor templates:
  - A long cylindrical capacitor.
  - A small chip-like capacitor.
- Both are represented as 2 pins in a vertical line.
- The small chip-like capacitor has row delta 3 between pins, such as `C1-C4`.

Still physically unknown:

- Their capacitance values.
- Their exact polarity, if polarized.

Current inferred model:

- Cylindrical capacitor `C1`: polarized, `+` at `L12` on the `U1.1A` timing node, `-` at `L13` on `VSS`.
- Small chip-like capacitor `C2`: currently modeled as non-polarized, between `M10` and `M13`, with row delta 3.
- If the physical `C2` part is polarized, use `M10` as `+` and `M13` as `-`.

## Power Unknowns

Known:

- Power should eventually enter the circuit through separate battery positive and battery negative lead components.
- These should each be 1-pin components.

Known:

- `BAT+1` is at `F17`.
- `BAT-1` is at `P17`.
- With `SW1` in state `B`, `BAT-1` is connected to the circuit `VSS` rail.

Still physically unknown:

- The battery voltage.
- Whether the app should automatically infer `VDD` and `VSS` from battery leads or let the user assign node labels manually.

Current inferred model:

- Treat battery positive and negative as normal 1-pin components with labels `BAT+` and `BAT-`.
- Use the current netlist as the analysis model, but do not run electrical simulation yet.
