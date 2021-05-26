const combineData = (soldiers, newSoldiers, skip) => {
  if (skip === 'true') {
    return soldiers.concat(newSoldiers);
  } else {
    return newSoldiers;
  }
}

export default combineData;