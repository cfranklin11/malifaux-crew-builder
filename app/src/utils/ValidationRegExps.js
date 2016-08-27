export function isLeader(ssLimit) {
  if (ssLimit <= 25) {
    return /henchman/i;
  }

  if (ssLimit > 40) {
    return /master/i;
  }

  return /master|henchman/i;
}

export function isValidCharacterOption(role) {
  if (role === 'leaders') {
    return /master|henchman/i;
  }

  return /[^(?:master)]/i;
}
