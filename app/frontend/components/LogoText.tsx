import { useState, useEffect } from 'react'

const GRAFFITI_FONTS = [
  { name: 'AnotherTag', scale: 1.5 },
  { name: 'Aerosoldier', scale: 1.1 },
  { name: 'TheJacatra', scale: 0.9 },
  { name: 'StreetSoul', scale: 1.3 },
  { name: 'FankyBubbleGraffiti-Line', scale: 1.2 },
]

interface LogoTextProps {
  text?: string
  className?: string
}

export default function LogoText({ text = 'Sick Stuff Shop', className = '' }: LogoTextProps) {
  const [fontIndex, setFontIndex] = useState(0)

  useEffect(() => {
    if (fontIndex >= GRAFFITI_FONTS.length - 1) return

    const timeout = setTimeout(() => {
      setFontIndex((prev) => prev + 1)
    }, 500)

    return () => clearTimeout(timeout)
  }, [fontIndex])

  return (
    <span
      data-logo-text
      className={className}
      style={{
        fontFamily: GRAFFITI_FONTS[fontIndex].name,
        transform: `scale(${GRAFFITI_FONTS[fontIndex].scale})`,
        display: 'inline-block',
      }}
    >
      {text}
    </span>
  )
}
