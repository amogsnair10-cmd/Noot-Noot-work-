import { useId } from 'react';

export type Mood = 'idle' | 'happy' | 'think' | 'talk' | 'wave';

/**
 * Pip, a little seed with a sprout. Pip grows as the learner levels up:
 * level 1 sprout, 2 more leaves, 3 a leafy branch, 4 a flower.
 */
export function Mascot({ size = 96, mood = 'idle', level = 1, float = false }: { size?: number; mood?: Mood; level?: number; float?: boolean }) {
  const id = useId().replace(/:/g, '');
  const happy = mood === 'happy';
  const think = mood === 'think';
  const talk = mood === 'talk';
  const wave = mood === 'wave' || happy;
  const INK = '#2A1B5C';

  return (
    <svg className={`pip ${float ? 'float' : ''} ${happy ? 'hop' : ''}`} width={size} height={size * 1.08} viewBox="0 0 160 172" aria-hidden>
      <defs>
        <linearGradient id={`b${id}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#FFE9A3" />
          <stop offset="0.55" stopColor="#FFC15C" />
          <stop offset="1" stopColor="#FF8D4A" />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7CF0B8" />
          <stop offset="1" stopColor="#1DB87A" />
        </linearGradient>
        <radialGradient id={`g${id}`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#FFD27A" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFD27A" stopOpacity="0" />
        </radialGradient>
        <filter id={`w${id}`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" />
        </filter>
      </defs>

      <circle cx="80" cy="108" r="76" fill={`url(#g${id})`} />
      <ellipse className="shadow" cx="80" cy="165" rx="38" ry="6" fill="#000" opacity=".28" />

      <g filter={`url(#w${id})`}>
        {/* sprout */}
        <g className="sprout">
          <path d="M80 56c0-12-2-20 0-32" stroke={INK} strokeWidth="9" strokeLinecap="round" fill="none" />
          <path d="M80 56c0-12-2-20 0-32" stroke="#2BD08E" strokeWidth="4.500" strokeLinecap="round" fill="none" />
          {level >= 3 && (
            <>
              <g className="leaf l1" style={{ transformOrigin: '80px 46px' }}>
                <path d="M80 46c-10-6-20-3-22 4 8 5 17 3 22-4Z" fill={`url(#l${id})`} stroke={INK} strokeWidth="3.500" strokeLinejoin="round" />
              </g>
              <g className="leaf l2" style={{ transformOrigin: '80px 40px' }}>
                <path d="M80 40c10-6 20-3 22 4-8 5-17 3-22-4Z" fill={`url(#l${id})`} stroke={INK} strokeWidth="3.500" strokeLinejoin="round" />
              </g>
            </>
          )}
          <g className="leaf l1" style={{ transformOrigin: '80px 30px' }}>
            <path d="M80 30C66 12 44 14 40 30c14 10 30 8 40 0Z" fill={`url(#l${id})`} stroke={INK} strokeWidth="3.500" strokeLinejoin="round" />
            <path d="M76 28c-8-4-14-4-22-1" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
          <g className="leaf l2" style={{ transformOrigin: '80px 30px' }}>
            <path d="M80 30C94 12 116 14 120 30c-14 10-30 8-40 0Z" fill={`url(#l${id})`} stroke={INK} strokeWidth="3.500" strokeLinejoin="round" />
            <path d="M84 28c8-4 14-4 22-1" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>
          {level >= 2 && level < 4 && (
            <g className="leaf l3" style={{ transformOrigin: '80px 26px' }}>
              <path d="M80 26c-7-8-6-16 0-22 6 6 7 14 0 22Z" fill={`url(#l${id})`} stroke={INK} strokeWidth="3.500" strokeLinejoin="round" />
            </g>
          )}
          {level >= 4 && (
            <g className="bloom" style={{ transformOrigin: '80px 18px' }}>
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse key={a} cx="80" cy="5" rx="9" ry="12" fill="#FF7DB1" stroke={INK} strokeWidth="3.200" transform={`rotate(${a} 80 20)`} />
              ))}
              <circle cx="80" cy="20" r="8.500" fill="#FFD84D" stroke={INK} strokeWidth="3.200" />
            </g>
          )}
        </g>

        {/* feet */}
        <ellipse cx="61" cy="158" rx="15" ry="8" fill="#FF8D4A" stroke={INK} strokeWidth="3.800" />
        <ellipse cx="99" cy="158" rx="15" ry="8" fill="#FF8D4A" stroke={INK} strokeWidth="3.800" />

        {/* left arm */}
        <g className={happy ? 'arm-up-l' : ''} style={{ transformOrigin: '38px 112px' }}>
          <path d="M38 114c-14 4-20 12-18 22" stroke={INK} strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M38 114c-14 4-20 12-18 22" stroke="#FFB860" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>

        {/* body */}
        <path d="M80 54C120 54 136 86 132 112c-4 28-24 46-52 46s-48-18-52-46C24 86 40 54 80 54Z" fill={`url(#b${id})`} stroke={INK} strokeWidth="4.500" strokeLinejoin="round" />
        <ellipse cx="80" cy="132" rx="30" ry="20" fill="#FFF4D2" opacity=".6" />
        <path d="M46 92c1-12 9-22 22-27" stroke="#fff" strokeOpacity=".7" strokeWidth="7" strokeLinecap="round" fill="none" />
        <circle cx="42" cy="104" r="3" fill="#fff" fillOpacity=".7" />

        {/* right arm (waves) */}
        <g className={wave ? 'arm-wave' : ''} style={{ transformOrigin: '122px 114px' }}>
          <path d="M122 114c14 0 22-8 22-20" stroke={INK} strokeWidth="13" strokeLinecap="round" fill="none" />
          <path d="M122 114c14 0 22-8 22-20" stroke="#FFB860" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>

        {/* eyes */}
        {happy ? (
          <>
            <path d="M52 104q10-14 20 0" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M88 104q10-14 20 0" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <g className="eyes" style={{ transformOrigin: '80px 102px' }}>
            <ellipse cx="62" cy="102" rx="10" ry="13" fill="#1B1340" />
            <ellipse cx="98" cy="102" rx="10" ry="13" fill="#1B1340" />
            <circle cx={think ? 67 : 65} cy={think ? 94 : 96} r="4.200" fill="#fff" />
            <circle cx={think ? 103 : 101} cy={think ? 94 : 96} r="4.200" fill="#fff" />
            <circle cx={think ? 60 : 59} cy={think ? 105 : 107} r="2" fill="#fff" />
            <circle cx={think ? 96 : 95} cy={think ? 105 : 107} r="2" fill="#fff" />
          </g>
        )}
        {think && <path d="M52 84q9-6 18-2" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />}

        {/* cheeks + mouth */}
        <ellipse cx="46" cy="120" rx="9" ry="6" fill="#FF6FA3" opacity=".6" />
        <ellipse cx="114" cy="120" rx="9" ry="6" fill="#FF6FA3" opacity=".6" />
        {happy ? (
          <>
            <path d="M68 118q12 24 24 0Z" fill="#7A1F3D" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
            <ellipse cx="80" cy="131" rx="7" ry="4" fill="#FF7AA2" />
          </>
        ) : talk ? (
          <g className="mouth" style={{ transformOrigin: '80px 124px' }}>
            <ellipse cx="80" cy="124" rx="8" ry="7" fill="#7A1F3D" stroke={INK} strokeWidth="3.800" />
          </g>
        ) : think ? (
          <path d="M72 126q8-5 16 0" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M68 120q12 12 24 0" stroke={INK} strokeWidth="4.200" strokeLinecap="round" fill="none" />
        )}
      </g>

      {happy && (
        <g className="twinkles" fill="#FFE27A" stroke={INK} strokeWidth="2">
          <path className="tw a" d="M20 54l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
          <path className="tw b" d="M142 44l2.500 6 6 2.500-6 2.500-2.500 6-2.500-6-6-2.500 6-2.500Z" />
          <path className="tw c" d="M138 138l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" />
        </g>
      )}
    </svg>
  );
}
