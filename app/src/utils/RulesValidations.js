import * as regExps from '../constants/RegExps';

function isPotentialLeader(station, ssLimit) {
  return regExps.MASTER_HENCHMAN_REGEXP.test(station);
}

export function isValidLeader(station, ssLimit, role) {
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

function isFollower(station) {
  return regExps.NOT_MASTER_REGEXP.test(station);
}

export function isCorrectRole(station, ssLimit, role) {
  if (regExps.LEADER_REGEXP.test(role)) {
    return isPotentialLeader(station, ssLimit);
  }
  return isFollower(station);
}

function isCorrectFaction(faction, characteristics, selectedFaction) {
  const factionRegExp = new RegExp(selectedFaction.replace(/\s/g, '-'), 'i');
  return factionRegExp.test(faction.replace(/\s/g, '-')) ||
    regExps.MERC_REGEXP.test(characteristics);
}

function isTotem(characteristics) {
  return regExps.TOTEM_REGEXP.test(characteristics);
}

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

function isLessThanLimit(limit, count) {
  return parseFloat(limit) === 0 || parseFloat(count) < parseFloat(limit);
}

export function isPotentialCharacter(character, stateProps) {
  const {station, faction, characteristics} = character;
  const {role, ssLimit, selectedFaction, leaderName} = stateProps;
  return isCorrectRole(station, ssLimit, role) &&
    isCorrectFaction(faction, characteristics, selectedFaction) &&
    isValidTotem(characteristics, leaderName);
}

export function isValidCharacter(character, stateProps) {
  const {station, faction, characteristics, limit, count} = character;
  const {role, ssLimit, selectedFaction, leaderName} = stateProps;
  return isCorrectRole(station, ssLimit, role) &&
    isValidLeader(station, ssLimit, role) &&
    isCorrectFaction(faction, characteristics, selectedFaction) &&
    isValidTotem(characteristics, leaderName) && isLessThanLimit(limit, count);
}
