import * as regExps from '../constants/RegExps';

function isCorrectFaction(faction, selectedFaction) {
  const factionRegExp = new RegExp(selectedFaction.replace(/\s/g, '-'), 'i');
  return factionRegExp.test(faction.replace(/\s/g, '-'));
}

// Some upgrades are character-specific
function isCorrectName(nameRestrictions, characterName) {
  if (nameRestrictions) {
    const nameRegExp = new RegExp(nameRestrictions.replace(/,\s/g, '|'), 'i');
    return nameRegExp.test(characterName);
  }
  return true;
}

// Some upgrades exclude certain characters
// (e.g. non-Master)
function isExcludedCharacter(
  restrictions1,
  restrictions2,
  character,
  leaderName) {
  // Capture any characteristics that come after 'non-',
  // then combine them and create a RegExp
  const nonRestrictionCapture1 =
    regExps.NON_CAPTURE_REGEXP.exec(restrictions1) || ['', ''];
  const nonRestrictionCapture2 =
    regExps.NON_CAPTURE_REGEXP.exec(restrictions2) || ['', ''];
  const nonRestriction1 = nonRestrictionCapture1[1];
  const nonRestriction2 = nonRestrictionCapture2[1];
  const separator = nonRestriction1 && nonRestriction2 ? '|' : '';
  const nonRestrictions = `${nonRestriction1}${separator}${nonRestriction2}`;
  const nonRestrictionsRegExp = nonRestrictions ?
    new RegExp(nonRestrictions, 'i') : null;

  // Check if the upgrade has exclusions
  if (nonRestrictionsRegExp) {
    // If 'non-Leader' is an exclusion, check if character is current leader
    return regExps.LEADER_REGEXP
        .test(nonRestriction1.concat(nonRestriction2)) ?
      character.name === leaderName :
      // Otherwise, check if character has excluded station/characteristics
      nonRestrictionsRegExp
        .test(character.station.concat(character.characteristics));
  }
  // If no exclusions, return 'false'
  return false;
}

// If upgrade is leader only, check if character is current leader
function isCorrectLeader(
  restrictions1,
  restrictions2,
  characterName,
  leaderName) {
  return regExps.LEADER_REGEXP.test(restrictions1.concat(restrictions2)) &&
    !regExps.NON_LEADER_REGEXP.test(restrictions1.concat(restrictions2)) ?
    characterName === leaderName : true;
}

// Check general station/characteristics restrictions (e.g. henchman, family),
// removing exclusion restrictions
function meetsRestrictions(
  restrictions1,
  restrictions2,
  station,
  characteristics) {
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

function isLessThanLimit(limit, count) {
  return parseFloat(limit) === 0 || parseFloat(count) < parseFloat(limit);
}

// Can only add one of a given upgrade to a character
function isAdded(upgradeName, characterUpgrades, characterVersion) {
  const upgradeIndex = characterUpgrades.findIndex(characterUpgrade => {
    return characterUpgrade.name === upgradeName;
  });

  return upgradeIndex === -1 ? false :
    characterUpgrades[upgradeIndex].versions.indexOf(characterVersion) !== -1;
}

// Different stations have different max upgrade limits
function isLessThanStationLimit(station, characterUpgrades) {
  const upgradeCount = characterUpgrades.length;
  return regExps.MASTER_REGEXP.test(station) && upgradeCount <= 3 ||
    regExps.HENCHMAN_REGEXP.test(station) && upgradeCount <= 2 ||
    regExps.ENFORCER_REGEXP.test(station) && upgradeCount <= 1;
}

// A given character can only have one 'limited' upgrade
function isDuplicateLimited(isLimited, characterUpgrades) {
  const limitedIndex = characterUpgrades.findIndex(upgrade => {
    return /true/i.test(isLimited);
  });
  return limitedIndex !== -1;
}

// Only henchmen, masters, and enforcers can have upgrades
export function isUpgradable(station) {
  return regExps.UPGRADABLE_REGEXP.test(station);
}

// Filter for upgrade select input: only displays upgrades that the character
// could potentially take
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

// Disables upgrade options that are currently invalid
export function isValidUpgrade(
  upgrade,
  character,
  stateProps,
  characterVersion) {
  const {limit, count, name, islimited} = upgrade;
  const {characterUpgrades, station} = character;
  return isPotentialUpgrade(upgrade, character, stateProps) &&
    isLessThanLimit(limit, count) &&
    !isAdded(name, characterUpgrades, characterVersion) &&
    isLessThanStationLimit(station, characterUpgrades) &&
    !isDuplicateLimited(islimited, characterUpgrades);
}
