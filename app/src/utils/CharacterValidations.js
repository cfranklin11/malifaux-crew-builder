import * as regExps from '../constants/RegExps';

// All henchman and masters can be leaders
function isPotentialLeader(station, ssLimit) {
  return regExps.MASTER_HENCHMAN_REGEXP.test(station);
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

function isCorrectRole(station, ssLimit, role) {
  if (regExps.LEADER_REGEXP.test(role)) {
    return isPotentialLeader(station, ssLimit);
  }
  return isFollower(station);
}

// All characters must be from the selected faction or non-leader mercenaries
function isCorrectFaction(faction, characteristics, selectedFaction, role) {
  const factionRegExp = new RegExp(selectedFaction.replace(/\s/g, '-'), 'i');
  return factionRegExp.test(faction.replace(/\s/g, '-')) ||
    regExps.MERC_REGEXP.test(characteristics) &&
    !regExps.LEADER_REGEXP.test(role);
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

export function isLessThanLimit(limit, count) {
  return parseFloat(limit) === 0 || parseFloat(count) < parseFloat(limit);
}

// Checks if a character has the potential to be valid, so it shows up
// on lists
export function isPotentialCharacter(character, stateProps) {
  const {station, faction, characteristics, name} = character;
  const {role, ssLimit, selectedFaction, leaderName} = stateProps;
  return isCorrectRole(station, ssLimit, role) &&
    isCorrectFaction(faction, characteristics, selectedFaction, role) &&
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
