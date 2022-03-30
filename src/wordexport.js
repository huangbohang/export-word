const wordexport = function(wrap) {
  const static_word = {
    mhtml: {
      top:
                'Mime-Version: 1.0\nContent-Base: ' +
                location.href +
                '\nContent-Type: Multipart/related; boundary="NEXT.ITEM-BOUNDARY";type="text/html"\n\n--NEXT.ITEM-BOUNDARY\nContent-Type: text/html; charset="utf-8"\nContent-Location: ' +
                location.href +
                '\n\n<!DOCTYPE html>\n' +
                '<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns="http://www.w3.org/TR/REC-html40">\n_html_</html>',
      head:
                '<head>\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\n<style>\n_styles_\n</style>\n<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:TrackMoves>false</w:TrackMoves><w:TrackFormatting/><w:ValidateAgainstSchemas/><w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid><w:IgnoreMixedContent>false</w:IgnoreMixedContent><w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText><w:DoNotPromoteQF/><w:LidThemeOther>EN-US</w:LidThemeOther><w:LidThemeAsian>ZH-CN</w:LidThemeAsian><w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript><w:Compatibility><w:BreakWrappedTables/><w:SnapToGridInCell/><w:WrapTextWithPunct/><w:UseAsianBreakRules/><w:DontGrowAutofit/><w:SplitPgBreakAndParaMark/><w:DontVertAlignCellWithSp/><w:DontBreakConstrainedForcedTables/><w:DontVertAlignInTxbx/><w:Word11KerningPairs/><w:CachedColBalance/><w:UseFELayout/></w:Compatibility><w:BrowserLevel>MicrosoftInternetExplorer4</w:BrowserLevel><m:mathPr><m:mathFont m:val="Cambria Math"/><m:brkBin m:val="before"/><m:brkBinSub m:val="--"/><m:smallFrac m:val="off"/><m:dispDef/><m:lMargin m:val="0"/> <m:rMargin m:val="0"/><m:defJc m:val="centerGroup"/><m:wrapIndent m:val="1440"/><m:intLim m:val="subSup"/><m:naryLim m:val="undOvr"/></m:mathPr></w:WordDocument></xml><![endif]--></head>\n',
      body: '<body>_body_</body>'
    }
  }
  const images = []

  const img = wrap.querySelectorAll('img')

  for (let i = 0; i < img.length; i++) {
    const uri = img[i].src

    // Save encoded image to array
    images[i] = {
      type: uri.substring(uri.indexOf(':') + 1, uri.indexOf(';')),
      encoding: uri.substring(uri.indexOf(';') + 1, uri.indexOf(',')),
      location: img[i].src,
      data: uri.substring(uri.indexOf(',') + 1)
    }
  }
  let mhtmlBottom = '\n'
  for (let i = 0; i < images.length; i++) {
    mhtmlBottom += '--NEXT.ITEM-BOUNDARY\n'
    mhtmlBottom += 'Content-Location: ' + images[i].location + '\n'
    mhtmlBottom += 'Content-Type: ' + images[i].type + '\n'
    mhtmlBottom +=
      'Content-Transfer-Encoding: ' + images[i].encoding + '\n\n'
    mhtmlBottom += images[i].data + '\n\n'
  }
  mhtmlBottom += '--NEXT.ITEM-BOUNDARY--'

  const styles = ''
  const fileContent =
          static_word.mhtml.top.replace(
            '_html_',
            static_word.mhtml.head.replace('_styles_', styles) +
            static_word.mhtml.body.replace('_body_', wrap.innerHTML)
          ) + mhtmlBottom
  // Create a Blob with the file contents
  const blob = new Blob([fileContent], {
    type: 'application/msword;charset=utf-8'
  })
  return blob
}
export default wordexport
