import saveAs from 'file-saver'
import html2canvas from 'html2canvas'
import wordexport from './wordexport'

class App {
  constructor(wordDom, _config = {}) {
    const defaultConfig = {
      addStyle: true,
      fileName: new Date().toLocaleString(),
      maxWidth: 624,
      toImg: '',
      success() {}
    }
    this.config = {}
    this.dom = wordDom
    this.c_dom = wordDom.cloneNode(true)
    this.config = { ...defaultConfig, ..._config }
  }

  async init() {
    // 将所有样式转换为行内样式
    this.config.addStyle && this.sheetToSelf(this.c_dom)
    // 将所有图片转化为base64
    await this.sheetToImg()
    // 将带有对应class名字dom转化为图片
    await this.domToCanvas()
  }
  async sheetToImg() {
    const img_doms = this.dom.querySelectorAll('img')
    const c_img_doms = this.c_dom.querySelectorAll('img')
    for (let i = 0; i < img_doms.length; i++) {
      c_img_doms[i].src = await this.toBase64(img_doms[i])
      this.imgStyleReset(c_img_doms[i], img_doms[i])
    }
  }
  async domToCanvas() {
    const str = this.config.toImg
    if (!str.length) {
      return
    }
    const canvas_doms = this.dom.querySelectorAll(str)
    const canvas_dom_clone = this.c_dom.querySelectorAll(str)
    for (let i = 0; i < canvas_doms.length; i++) {
      const src = await this.toBase64(canvas_doms[i])
      const img = new Image()
      img.src = src
      this.imgStyleReset(img, canvas_doms[i])
      canvas_dom_clone[i].innerHTML = ''
      canvas_dom_clone[i].appendChild(img)
    }
  }
  exportWord() {
    saveAs(wordexport(this.c_dom), this.config.fileName + '.doc')
    this.config.success()
  }
  sheetToSelf(dom) {
    const sheets = document.styleSheets
    const $dom = dom

    function cssTextToJSON(cssText) {
      const arr = cssText.split(';')
      arr.splice(arr.length - 1, 1)
      const obj = {}
      arr.forEach((item) => {
        const attrName = item.split(':')[0]
        obj[attrName.replace(/ /g, '')] = item.split(':').map((i, index) => (index ? i : '')).join('')
      })
      return obj
    }
    for (let i = 0, l = sheets.length; i < l; i++) {
      try {
        sheets[i].rules || sheets[i].cssRules
      } catch (e) {
        console.warn("Can't read the css rules of: " + sheets[i].href, e)
        continue
      }

      const { rules, cssRules } = sheets[i]
      const rulesArry = Array.from(rules || cssRules || [])
      rulesArry.forEach((rule) => {
        const { selectorText, style } = rule
        if (selectorText !== '*') {
          try {
            const select = $dom.querySelectorAll(selectorText)
            select.forEach((dom) => {
              if (dom.style.cssText) {
                const oldCssText = cssTextToJSON(dom.style.cssText)
                const newCssText = cssTextToJSON(style.cssText)
                for (const i in newCssText) {
                  oldCssText[i] = newCssText[i]
                }
                for (const i in oldCssText) {
                  dom.style[i] = oldCssText[i]
                }
              } else {
                dom.style.cssText = style.cssText
              }
            })
          } catch (e) {
            console.log('转换成行内样式失败', e)
          }
        }
      })
    }
  }
  imgStyleReset(dom, coverDom) {
    const { maxWidth } = this.config
    const width = Math.min(coverDom.clientWidth, maxWidth)
    const height = coverDom.clientHeight * width / coverDom.clientWidth
    dom.width = width
    dom.height = height
    return dom
  }
  toBase64(element) {
    return new Promise((resolve) => {
      html2canvas(element).then((canvas) => {
        const data = canvas.toDataURL('image/jpeg', 1.0)
        resolve(data)
      })
    })
  }
}
export default App
