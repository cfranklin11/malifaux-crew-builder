import * as regExps from '../constants/RegExps';

function factionRegExp(selectedFaction) {
  return new RegExp(selectedFaction.replace(/\s/g, '-'), 'i');
}

// All henchman and masters can be leaders
function isPotentialLeader(
  station,
  ssLimit,
  faction,
  characteristics,
  selectedFaction) {
  return regExps.MASTER_HENCHMAN_REGEXP.test(station) &&
    !isNonFactionMercenary(faction, characteristics, selectedFaction);
}

// Check current soulstone limit for which stations are valid leaders
// (defaults to true for followers)
function isValidLeader(station, ssLimit, role) {
  if (regExps.LEADER_REGEXP.test(role)) {
    if (ssLimit <= 25) {
      return regExps.HENCHMAN_REGEXP.test(station);
    }
    if (ssLimit > 40) {
      return regExps.MASTER_REGEXP.test(station);
    }
    return regExps.MASTER_HENCHMAN_REGEXP.test(station);
  }
  return true;
}

// All non-masters can be followers
function isFollower(station) {
  return regExps.NOT_MASTER_REGEXP.test(station);
}

function isCorrectRole(character, ssLimit, selectedFaction, role) {
  const {station, faction, characteristics} = character;
  if (regExps.LEADER_REGEXP.test(role)) {
    return isPotentialLeader(
      station,
      ssLimit,
      faction,
      characteristics,
      selectedFaction);
  }
  return isFollower(station);
}

function isNonFactionMercenary(faction, characteristics, selectedFaction) {
  return !factionRegExp(selectedFaction).test(faction.replace(/\s/g, '-')) &&
    regExps.MERC_REGEXP.test(characteristics);
}

// All characters must be from the selected faction or non-leader mercenaries
function isCorrectFaction(faction, characteristics, selectedFaction) {
  return factionRegExp(selectedFaction).test(faction.replace(/\s/g, '-')) ||
    isNonFactionMercenary(faction, characteristics, selectedFaction);
}

function isTotem(characteristics) {
  return regExps.TOTEM_REGEXP.test(characteristics);
}

// Check if totem is limited to particular master, then check if that master
// is the current leader
function isValidTotem(characteristics, leaderName) {
  const allRegExpString = '.*';
  if (isTotem(characteristics)) {
    const totemMaster =
      regExps.RESTRICTED_TOTEM_REGEXP.test(characteristics) ?
      regExps.RESTRICTED_TOTEM_REGEXP.exec(characteristics)[1] :
      allRegExpString;
    const totemMasterRegExp = new RegExp(totemMaster, 'i');
    return totemMasterRegExp.test(leaderName);
  }
  return true;
}

function isLessThanTotemLimit(characters, characteristics) {
  let totemCount = 0;
  for (let i = 0; i < characters.length; i++) {
    const thisCharacter = characters[i];
    const {characteristics} = thisCharacter;
    if (thisCharacter.count > 0 &&
      isTotem(characteristics)) {
      totemCount++;
    }
  }
  return totemCount < 1 ||
    !isTotem(characteristics);
}

function isLessThanMercLimit(
  characters,
  selectedFaction,
  faction,
  characteristics) {
  let mercCount = 0;
  for (let i = 0; i < characters.length; i++) {
    const thisCharacter = characters[i];
    const {faction, characteristics} = thisCharacter;
    if (thisCharacter.count > 0 &&
      isNonFactionMercenary(faction, characteristics, selectedFaction)) {
      mercCount++;
    }
  }
  return mercCount < 2 ||
    !isNonFactionMercenary(faction, characteristics, selectedFaction);
}

function isLessThanRareLimit(limit, count) {
  return (parseFloat(limit) === 0 || parseFloat(count) < parseFloat(limit));
}

export function isLessThanLimits(characters, character, selectedFaction) {
  const {faction, characteristics, limit, count} = character;
  return isLessThanRareLimit(limit, count) &&
    isLessThanTotemLimit(characters, characteristics) &&
    isLessThanMercLimit(characters, selectedFaction, faction, characteristics);
}

// Checks if a character has the potential to be valid, so it shows up
// on lists
export function isPotentialCharacter(character, stateProps) {
  const {faction, characteristics, name} = character;
  const {role, ssLimit, selectedFaction, leaderName} = stateProps;
  return isCorrectRole(character, ssLimit, selectedFaction, role) &&
    isCorrectFaction(faction, characteristics, selectedFaction) &&
    isValidTotem(characteristics, leaderName) &&
    name.toLowerCase() !== 'lord chompy bits';
}

// Checks if a character is currently valid, so invalid ones are disabled
export function isValidCharacter(character, stateProps) {
  const {station} = character;
  const {role, ssLimit} = stateProps;
  return isPotentialCharacter(character, stateProps) &&
    isValidLeader(station, ssLimit, role);
}
