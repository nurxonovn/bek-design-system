import React, { useState, type ComponentType, type ReactNode } from 'react';
import { ControlGroup, ScrubField, Select, SwitchField } from '@bek-ui/react';
import {
  Aurora,
  DotField,
  GrainGradient,
  MatrixRain,
  type AuroraPosition,
  type BackgroundIntensity,
  type MatrixRainCharset,
  type MatrixRainTone,
} from '@bek-ui/backgrounds';

// @bek-ui/backgrounds o'yin maydonchalari: fon + ControlGroup (ScrubField, SwitchField, Select) bilan jonli sozlash.

type Tone = 'neutral' | 'brand';

function Stage({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{ minHeight: 320, isolation: 'isolate' }}
    >
      {children}
      <div
        className="relative flex flex-col justify-end gap-1 p-6"
        style={{ minHeight: 320, color: dark ? 'var(--bek-static-white)' : 'var(--bek-text-primary)' }}
      >
        <p className="text-2xl font-semibold">BEK bilan dizaynni o'rganing</p>
        <p className="text-sm">Kurslar, amaliyot va karyera yo'li — bir joyda.</p>
      </div>
    </div>
  );
}

function Panels({ children }: { children: ReactNode }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function Playground({ stage, controls }: { stage: ReactNode; controls: ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-6">
      {stage}
      <Panels>{controls}</Panels>
    </div>
  );
}

function ToneSelect<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <Select label="Ton" value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map(([v, label]) => (
        <option key={v} value={v}>
          {label}
        </option>
      ))}
    </Select>
  );
}

function IntensitySelect({
  value,
  onChange,
}: {
  value: BackgroundIntensity;
  onChange: (v: BackgroundIntensity) => void;
}) {
  return (
    <Select
      label="Intensivlik"
      value={value}
      onChange={(e) => onChange(e.target.value as BackgroundIntensity)}
    >
      <option value="subtle">Subtle</option>
      <option value="default">Default</option>
      <option value="intense">Intense</option>
    </Select>
  );
}

const TONES: [Tone, string][] = [
  ['neutral', 'Neutral'],
  ['brand', 'Brand'],
];

function MatrixRainDemo() {
  const [tone, setTone] = useState<MatrixRainTone>('neutral');
  const [intensity, setIntensity] = useState<BackgroundIntensity>('default');
  const [charset, setCharset] = useState<MatrixRainCharset>('mixed');
  const [pointer, setPointer] = useState(true);
  const [speed, setSpeed] = useState(1.75);
  const [frameInterval, setFrameInterval] = useState(134);
  const [trail, setTrail] = useState(94);
  const [density, setDensity] = useState(1);
  const [highlight, setHighlight] = useState(true);
  const [radius, setRadius] = useState(122);
  const [persistence, setPersistence] = useState(64);
  const [opacity, setOpacity] = useState(70);
  return (
    <Playground
      stage={
        <Stage dark={tone === 'classic'}>
          <MatrixRain
            tone={tone}
            intensity={intensity}
            charset={charset}
            pointer={pointer}
            speed={speed}
            frameInterval={frameInterval}
            trail={trail}
            density={density}
            opacity={opacity}
            pointerHighlight={highlight}
            radius={radius}
            highlightPersistence={persistence}
          />
        </Stage>
      }
      controls={
        <>
          <ControlGroup title="Ko'rinish">
            <ToneSelect
              value={tone}
              onChange={setTone}
              options={[...TONES, ['classic', 'Classic']]}
            />
            <IntensitySelect
              value={intensity}
              onChange={(v) => {
                setIntensity(v);
                setOpacity({ subtle: 40, default: 70, intense: 100 }[v]);
              }}
            />
            <Select label="Belgilar" value={charset} onChange={(e) => setCharset(e.target.value)}>
              <option value="mixed">Mixed</option>
              <option value="latin">Latin</option>
              <option value="cyrillic">Cyrillic</option>
              <option value="digits">Digits</option>
              <option value="BEK01">BEK01 (o'z satri)</option>
            </Select>
            <SwitchField
              label="Kursor nuri"
              checked={pointer}
              onChange={(e) => setPointer(e.target.checked)}
            />
          </ControlGroup>
          <ControlGroup title="Harakat">
            <ScrubField label="Tezlik" value={speed} onChange={setSpeed} min={0.25} max={4} step={0.05} unit="×" />
            <ScrubField label="Kadr oralig'i" value={frameInterval} onChange={setFrameInterval} min={40} max={500} unit="ms" />
            <ScrubField label="Iz davomiyligi" value={trail} onChange={setTrail} max={100} unit="%" />
            <ScrubField label="Zichlik" value={density} onChange={setDensity} min={0.25} max={2} step={0.05} unit="×" />
          </ControlGroup>
          <ControlGroup title="Kursor" density="compact">
            <ScrubField label="Shaffoflik" value={opacity} onChange={setOpacity} max={100} unit="%" />
            <ScrubField label="Radius" value={radius} onChange={setRadius} max={400} unit="px" />
            <ScrubField label="Yoritish davomiyligi" value={persistence} onChange={setPersistence} max={100} unit="%" />
            <SwitchField
              label="Kursor yoritilishi"
              checked={highlight}
              onChange={(e) => setHighlight(e.target.checked)}
            />
          </ControlGroup>
        </>
      }
    />
  );
}

function DotFieldDemo() {
  const [tone, setTone] = useState<Tone>('neutral');
  const [intensity, setIntensity] = useState<BackgroundIntensity>('default');
  const [pointer, setPointer] = useState(true);
  const [gap, setGap] = useState(20);
  const [dotSize, setDotSize] = useState(2);
  const [speed, setSpeed] = useState(1);
  const [radius, setRadius] = useState(150);
  const [highlight, setHighlight] = useState(true);
  const [ripple, setRipple] = useState(true);
  return (
    <Playground
      stage={
        <Stage>
          <DotField
            tone={tone}
            intensity={intensity}
            pointer={pointer}
            gap={gap}
            dotSize={dotSize}
            speed={speed}
            radius={radius}
            pointerHighlight={highlight}
            rippleOnClick={ripple}
          />
        </Stage>
      }
      controls={
        <>
          <ControlGroup title="Ko'rinish">
            <ToneSelect value={tone} onChange={setTone} options={TONES} />
            <IntensitySelect
              value={intensity}
              onChange={(v) => {
                setIntensity(v);
                setDotSize({ subtle: 1.5, default: 2, intense: 2.5 }[v]);
              }}
            />
            <SwitchField label="Kursor nuri" checked={pointer} onChange={(e) => setPointer(e.target.checked)} />
          </ControlGroup>
          <ControlGroup title="To'r">
            <ScrubField label="Qadam" value={gap} onChange={setGap} min={8} max={48} unit="px" />
            <ScrubField label="Nuqta" value={dotSize} onChange={setDotSize} min={0.5} max={6} step={0.5} unit="px" />
            <ScrubField label="Tezlik" value={speed} onChange={setSpeed} min={0} max={4} step={0.05} unit="×" />
          </ControlGroup>
          <ControlGroup title="Kursor" density="compact">
            <ScrubField label="Radius" value={radius} onChange={setRadius} max={400} unit="px" />
            <SwitchField label="Kursor yoritilishi" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} />
            <SwitchField label="Bosganda halqa" checked={ripple} onChange={(e) => setRipple(e.target.checked)} />
          </ControlGroup>
        </>
      }
    />
  );
}

function GrainGradientDemo() {
  const [tone, setTone] = useState<Tone>('neutral');
  const [intensity, setIntensity] = useState<BackgroundIntensity>('default');
  const [speed, setSpeed] = useState(1);
  const [grain, setGrain] = useState(0.28);
  return (
    <Playground
      stage={
        <Stage>
          <GrainGradient tone={tone} intensity={intensity} speed={speed} grain={grain} />
        </Stage>
      }
      controls={
        <>
          <ControlGroup title="Ko'rinish">
            <ToneSelect value={tone} onChange={setTone} options={TONES} />
            <IntensitySelect
              value={intensity}
              onChange={(v) => {
                setIntensity(v);
                setGrain({ subtle: 0.18, default: 0.28, intense: 0.4 }[v]);
              }}
            />
          </ControlGroup>
          <ControlGroup title="Harakat">
            <ScrubField label="Tezlik" value={speed} onChange={setSpeed} min={0} max={8} step={0.05} unit="×" />
            <ScrubField label="Donadorlik" value={grain} onChange={setGrain} min={0} max={1} step={0.01} />
          </ControlGroup>
        </>
      }
    />
  );
}

function AuroraDemo() {
  const [tone, setTone] = useState<Tone>('neutral');
  const [intensity, setIntensity] = useState<BackgroundIntensity>('default');
  const [speed, setSpeed] = useState(1);
  const [bands, setBands] = useState(3);
  const [position, setPosition] = useState<AuroraPosition>('top');
  return (
    <Playground
      stage={
        <Stage>
          <Aurora tone={tone} intensity={intensity} speed={speed} bands={bands} position={position} />
        </Stage>
      }
      controls={
        <>
          <ControlGroup title="Ko'rinish">
            <ToneSelect value={tone} onChange={setTone} options={TONES} />
            <IntensitySelect value={intensity} onChange={setIntensity} />
            <Select
              label="Joylashuv"
              value={position}
              onChange={(e) => setPosition(e.target.value as AuroraPosition)}
            >
              <option value="top">Top</option>
              <option value="center">Center</option>
            </Select>
          </ControlGroup>
          <ControlGroup title="Harakat">
            <ScrubField label="Tezlik" value={speed} onChange={setSpeed} min={0} max={8} step={0.05} unit="×" />
            <ScrubField label="Tasmalar" value={bands} onChange={setBands} min={1} max={5} step={1} />
          </ControlGroup>
        </>
      }
    />
  );
}

export const backgroundDemos: Record<string, ComponentType> = {
  'matrix-rain': MatrixRainDemo,
  'dot-field': DotFieldDemo,
  'grain-gradient': GrainGradientDemo,
  aurora: AuroraDemo,
};
