import * as regExps from '../constants/RegExps';

function isUpgradable(station) {
  return regExps.UPGRADABLE_REGEXP.test(station);
}

function isCorrectFaction(faction, selectedFaction) {
  const factionRegExp = new RegExp(selectedFaction.replace(/\s/g, '-'), 'i');

  return factionRegExp.test(faction.replace(/\s/g, '-'));
}

function isCorrectName(nameRestrictions, characterName) {
  if (nameRestrictions) {
    const nameRegExp = new RegExp(nameRestrictions.replace(/,\s/g, '|'), 'i');
    return nameRegExp.test(characterName);
  }

  return true;
}

function isExcludedCharacter(
  restrictions1, restrictions2, character, leaderName) {
  const nonRestrictionCapture1 =
    regExps.NON_CAPTURE_REGEXP.exec(restrictions1) || ['', ''];
  const nonRestrictionCapture2 =
    regExps.NON_CAPTURE_REGEXP.exec(restrictions2) || ['', ''];
  const nonRestriction1 = nonRestrictionCapture1[1];
  const nonRestriction2 = nonRestrictionCapture2[1];
  const separator = nonRestriction1 && nonRestriction2 ? '|' : '';
  const nonRestrictions = `${nonRestriction1}${separator}${nonRestriction2}`;
  const nonRestrictionsRegExp =
    nonRestrictions ? new RegExp(nonRestrictions, 'i') : null;

  if (nonRestrictionsRegExp) {
    return nonRestrictionsRegExp
      .test(character.station.concat(character.characteristics));
  }

  return regExps.LEADER_REGEXP.test(nonRestriction1.concat(nonRestriction2)) ?
    character.name === leaderName : false;
}

function isCorrectLeader(
  restrictions1, restrictions2, characterName, leaderName) {
  return regExps.LEADER_REGEXP.test(restrictions1.concat(restrictions2)) &&
    !regExps.NON_LEADER_REGEXP.test(restrictions1.concat(restrictions2)) ?
    characterName === leaderName : true;
}

function meetsRestrictions(
  restrictions1, restrictions2, station, characteristics) {
  const restrictions1RegExp =
    new RegExp(restrictions1
      .replace(/,\s/g, '|')
      .replace(regExps.NON_REGEXP, '')
      .replace(regExps.LEADER_REGEXP, ''));
  const restrictions2RegExp =
    new RegExp(restrictions2
      .replace(/,\s/g, '|')
      .replace(regExps.NON_REGEXP, '')
      .replace(regExps.LEADER_REGEXP, ''));

  return restrictions1RegExp.test(station.concat(characteristics)) &&
    restrictions2RegExp.test(station.concat(characteristics));
}

export function isPotentialUpgrade(upgrade, character, stateProps) {
  const {
    faction,
    namerestrictions: nameRestrictions,
    characteristicrestrictions1: restrictions1,
    characteristicrestrictions2: restrictions2
  } = upgrade;
  const {selectedFaction, leaderName} = stateProps;
  const {station, name, characteristics} = character;

  return isUpgradable(station) && isCorrectFaction(faction, selectedFaction) &&
    isCorrectName(nameRestrictions, name) &&
    !isExcludedCharacter(restrictions1, restrictions2, character, leaderName) &&
    isCorrectLeader(restrictions1, restrictions2, name, leaderName) &&
    meetsRestrictions(restrictions1, restrictions2, station, characteristics);
}
