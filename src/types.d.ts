export interface CustomBadges {
  customBadgesArray: {
    badge: string;
    name: string;
    badges: [
      {
        name: string;
        badge: string;
      },
    ];
  };
  aliu: {
    dev: boolean;
    donor: boolean;
    contributor: boolean;
    custom: {
      url: string;
      text: string;
    };
  };
  bd: {
    dev: boolean;
  };
  enmity: {
    supporter: {
      data: {
        name: string;
        id: string;
        url: {
          dark: string;
          light: string;
        };
      };
    };
    staff: {
      data: {
        name: string;
        id: string;
        url: {
          dark: string;
          light: string;
        };
      };
    };
    dev: {
      data: {
        name: string;
        id: string;
        url: {
          dark: string;
          light: string;
        };
      };
    };
    contributor: {
      data: {
        name: string;
        id: string;
        url: {
          dark: string;
          light: string;
        };
      };
    };
  };
  goosemod: {
    sponsor: boolean;
    dev: boolean;
    translator: boolean;
  };
  vencord: {
    contributor: boolean;
    cutie: [
      {
        tooltip: string;
        badge: string;
      },
    ];
  };
  userpfp: string;
}

export interface BadgeArgs {
  guildId: string;
  user: User;
}

export type BadgeMod = (args: BadgeArgs) => React.ReactElement<{
  children: React.ReactElement[];
  className: string;
}>;

export type BadgeCache = {
  badges: CustomBadges;
  lastFetch: number;
};
