import React, {useEffect, useState, useRef} from 'react'
import './App.css'
import * as d3 from 'd3'

const BOXWIDTH = 20
const randomCommon = d3.randomInt(1, 33)
const randomSpecial = d3.randomInt(1, 16)
const randomOpacity = d3.randomUniform(0, 1)
const intervalTime = 400
const luckyColor = '#ffb31a'

const App = () => {
  const luckyNumber = useRef(-1)
  const luckyIndex = useRef(-1)
  const luckyList = useRef([])
  const [commonStr, setCommonStr] = useState('')
  const [specialStr, setSpecialStr] = useState('')
  const [buttonDisable, setButtonDisable] = useState(false)

  useEffect(() => {
    const w = 800
    const h = 250

    const svg = d3.select("#box").append("svg")
      .attr("width", w)
      .attr("height", h)

    const boxContaner = svg.append('g')
      .attr('transform', 'translate(100, 20)')
      .attr('id', 'box-container')

    const ballCommon = Array.from(new Array(33).keys())
    const ballSpecial = Array.from(new Array(16).keys())

    for (let col = 0; col < 6; col++) {
      const colContainer = boxContaner.append('g').attr('id', `col-${col}`)

      colContainer.selectAll('rect')
        .data(ballCommon)
        .enter()
        .append('rect')
        .attr('width', BOXWIDTH)
        .attr('height', BOXWIDTH)
        .attr('fill', '#ccc')
        .attr('opacity', (d, i) => col % 2 === 0 ? (i % 2 === 0 ? 1 : 0.5) : (i % 2 === 0 ? 0.5 : 1))
        .attr('x', (d, i) => i * BOXWIDTH)
        .attr('y', d => (col + 1) * BOXWIDTH)
    }

    // special
    const colContainer = boxContaner.append('g').attr('id', 'col-6')

    colContainer.selectAll('rect')
      .data(ballSpecial)
      .enter()
      .append('rect')
      .attr('width', BOXWIDTH)
      .attr('height', BOXWIDTH)
      .attr('fill', '#ccc')
      .attr('opacity', (d, i) => (i % 2 === 0 ? 1 : 0.5))
      .attr('x', (d, i) => i * BOXWIDTH)
      .attr('y', d => 7 * BOXWIDTH + 20)

    // 渲染数字
    const indexNumber = Array.from(new Array(33).keys())

    const numberContainer = svg.append('g').attr('id', 'number-container')

    numberContainer.selectAll('text')
      .data(indexNumber)
      .enter()
      .append('text')
      .text(d => d + 1)
      .attr('fill', '#ccc')
      .attr('x', (d, i) => i * 20 + 100)
      .attr('y', 30)
    
  }, [])

  const start = () => {
    setButtonDisable(true)
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const t1 = new Date().getTime()
        randomBoxOpacity(t1, i)
      }, intervalTime * 10 * i)
    }
  }

  const setLuckyBox = () => {
    const targetNode = d3.select('#box-container').selectAll(`#col-${luckyIndex.current} rect`).nodes()[luckyNumber.current - 1]
    setTimeout(() => {
      d3.select(targetNode)
        .attr('fill', luckyColor)
        .attr('opacity', 1)

      if (luckyList.current.length === 7) {
        showFinalNumbers()
      }
    }, 200)
  }

  const randomBoxOpacity = (t1, index) => {
    const interval = d3.interval(() => {
      if (new Date().getTime() - t1 > intervalTime * 10) {
        luckyIndex.current += 1
        luckyNumber.current = getLuckyNumber()
        setLuckyBox()
        interval.stop()
      }

      const targetBoxes = d3.select(`#col-${index}`).selectAll('rect').nodes()
      targetBoxes.forEach(d => {
        d3.select(d)
          .transition()
          .duration(100)
          .attr('opacity', randomOpacity())
      })
    }, 100)
  }

  const getLuckyNumber = () => {
    let isAdded = false
    let newNumber
    while (!isAdded) {
      if (luckyList.current.length < 6) {
        newNumber = randomCommon()
        if (!luckyList.current.includes(newNumber)) {
          luckyList.current.push(newNumber)
          isAdded = true
        }
      } else {
        newNumber = randomSpecial()
        luckyList.current.push(newNumber)
        isAdded = true
      }
    }

    return newNumber
  }

  const showFinalNumbers = () => {
    let commonNumbers = luckyList.current.slice(0, 6).sort((a, b) => a - b)
    let str = JSON.stringify(commonNumbers)
    str = str.replace('[', '')
    str = str.replace(']', '')

    setCommonStr(str)
    setSpecialStr(luckyList.current.pop())
  }

  return (
    <div>
      <div className="title-container">
        <div className="title">今 日 财 富 密 码</div>
        <button
          className="click-button"
          disabled={buttonDisable}
          onClick={() => start()}
        >
          一 击 必 不 中
        </button>
      </div>
      <div id="box" />
      <div className="lucky-number">
        <span>{commonStr}</span>
        <span className="special">{specialStr}</span>
      </div>
    </div>
  )
}

export default App
