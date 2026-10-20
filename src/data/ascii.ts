// All ASCII art in the project is original.

/** Grille + VENT wordmark, side by side (eyes are rendered separately in the hero). */
export const grille = ['+---------+', '|=========|', '|===o=o===|', '|=========|', '+---------+'].join('\n');

export const logo = [
  '__     _______ _   _ _____ ',
  '\\ \\   / / ____| \\ | |_   _|',
  ' \\ \\ / /|  _| |  \\| | | |  ',
  '  \\ V / | |___| |\\  | | |  ',
  '   \\_/  |_____|_| \\_| |_|  ',
].join('\n');

export const mascot = [
  '+------------+',
  '|============|',
  '|===(o)(o)===|',
  '|============|',
  '|============|',
  '+------------+',
].join('\n');

export const art: Record<string, string> = {
  cover: ['  .--------.  ', ' /|========|  ', '/ |==o==o==|  ', '| |========|  ', "| '--------'  "].join('\n'),
  fan: ['    \\  |  /   ', '  -- (  ) --  ', '    /  |  \\   ', '  [========]  ', '  [========]  '].join('\n'),
  soot: ['  .  ##  .    ', ' ## #### ##   ', '  ###30K###   ', ' ## #### ##   ', '  .  ##  .    '].join('\n'),
};

export const emptyBox = [
  '+-------------------+',
  '|===================|',
  '|==  nothing here ==|',
  '|==  not yet.     ==|',
  '|===================|',
  '+-------------------+',
].join('\n');

export const bar = (pct: number, width = 20): { full: string; empty: string } => {
  const filled = Math.round((pct / 50) * width);
  const f = Math.min(width, Math.max(0, filled));
  return { full: '#'.repeat(f), empty: '.'.repeat(width - f) };
};
