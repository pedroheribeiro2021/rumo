import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/react'
import { ProgressBar } from './ProgressBar'

describe('ProgressBar', () => {
  it('renderiza a largura proporcional ao value/max', () => {
    const { container } = render(<ProgressBar value={50} max={100} />)
    const fill = container.firstChild?.firstChild as HTMLElement
    expect(fill.style.width).toBe('50%')
  })

  it('não deixa a largura passar de 100% quando value > max', () => {
    const { container } = render(<ProgressBar value={150} max={100} />)
    const fill = container.firstChild?.firstChild as HTMLElement
    expect(fill.style.width).toBe('100%')
  })

  it('não fica negativo quando value < 0', () => {
    const { container } = render(<ProgressBar value={-10} max={100} />)
    const fill = container.firstChild?.firstChild as HTMLElement
    expect(fill.style.width).toBe('0%')
  })
})
