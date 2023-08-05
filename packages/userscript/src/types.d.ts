declare type UserjsDiggerSettings = {
  /** language */
  locale: string;
  /** add Sleazyfork result */
  nsfw: boolean;
  /** filtered keywords */
  filter: string[];
  /** debugger */
  debugger: boolean;
};

export interface GreasyforkScriptUser {
  id: number
  name: string
  url: string
}

export interface GreasyforkScript {
  bad_ratings: number
  code_updated_at: string
  code_url: string
  contribution_amount: null | number
  contribution_url: null | string
  created_at: string
  daily_installs: number
  deleted: false
  description: string
  fan_score: string
  good_ratings: number
  id: number
  license: null | string
  locale: string
  name: string
  namespace: string
  ok_ratings: number
  support_url: null | string
  total_installs: number
  url: string
  users: GreasyforkScriptUser[]
  version: string
}
