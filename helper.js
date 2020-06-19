function buildLinkText(prefix, link) {
    if (link != undefined) {
      if (prefix != undefined) {
        return prefix + " " + link;
      }
      else return link;
    }
  }

function getResolvedValues(data, slot) {
    if (   data
        && data.message
        && data.message.currentIntent
        && data.message.currentIntent.slotDetails
        && data.message.currentIntent.slotDetails[slot]
        && data.message.currentIntent.slotDetails[slot].resolutions
        && data.message.currentIntent.slotDetails[slot].resolutions) return data.message.currentIntent.slotDetails[slot].resolutions;
    else return undefined;
}

function getSpokenDisambiguation(values) {
    var response = "";
    for (var i=0;i<values.length;i++)
    {
        if (i === values.length-1) response += ", or ";
        else if (i > 0) response += ", ";
        response+= values[i].value
    }
    return response;
}

module.exports = {
    buildLinkText,
    getResolvedValues,
    getSpokenDisambiguation
};