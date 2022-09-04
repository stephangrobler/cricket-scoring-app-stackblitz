export interface Match {
  id: string;
  innings: Innings[];
}

export interface Innings {
  overs: Over[];
}

export interface Over {
  bowler: string;
  balls: Ball[];
}

export interface Ball {}

export interface Team {}

export interface Player {}
