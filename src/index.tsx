import { User } from "discord-types/general";
import { Injector, common, webpack } from "replugged";
import { getBadges } from "./customBadges";
const { React } = common;
const inject = new Injector();

interface BadgeArgs {
  guildId: string;
  user: User;
}

type BadgeMod = (args: BadgeArgs) => React.ReactElement<{
  children: React.ReactElement[];
  className: string;
}>;

interface CustomBadges {
  customBadgesArray: {
    badge: string;
    name: string;
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
}

type BadgeCache = {
  badges: CustomBadges;
  lastFetch: number;
};

const cache = new Map<string, BadgeCache>();
const REFRESH_INTERVAL = 1000 * 60 * 30;

export async function start(): Promise<void> {
  const mod = await webpack.waitForModule<Record<string, BadgeMod>>(
    webpack.filters.bySource(".GUILD_BOOSTER_LEVEL_1,"),
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fnPropName = Object.entries(mod).find(([_, v]) => typeof v === "function")?.[0];
  if (!fnPropName) {
    throw new Error("Could not find badges function");
  }
  const Badge = await getBadges();

  inject.after(
    mod,
    fnPropName,
    (
      [
        {
          user: { id },
        },
      ],
      res,
    ) => {
      if (!res?.props?.children) return res;

      const [badges, setBadges] = React.useState<CustomBadges | null>(null);

      React.useEffect(() => {
        (async () => {
          await fetchBadges(id, setBadges);
        })();
      }, []);

      if (!badges) return res;

      const { containerWithContent } = webpack.getByProps("containerWithContent") as Record<
        string,
        string
      >;

      res.props.children = [...res.props.children, ...getBadgeselements(badges, Badge, id)];

      if (res.props.children.length > 0) {
        if (!res.props.className.includes(containerWithContent)) {
          res.props.className += ` ${containerWithContent}`;
        }
        if (!res.props.className.includes("global-badges-container")) {
          res.props.className += " global-badges-container";
        }
      }

      return res;
    },
  );
}

async function fetchBadges(id: string, setBadges: Function): Promise<CustomBadges> {
  if (!cache.has(id) || cache.get(id)!.lastFetch < Date.now() - REFRESH_INTERVAL) {
    const res = await fetch(`https://api.obamabot.me/v2/text/badges?user=${id}`);
    const body = (await res.json()) as CustomBadges;
    const result: BadgeCache =
      res.status === 200 || res.status === 404
        ? { badges: body || {}, lastFetch: Date.now() }
        : (cache.delete(id), { badges: body, lastFetch: Date.now() });

    cache.set(id, result);
  }

  setBadges(cache.get(id)?.badges || null);
  return cache.get(id)!.badges;
}

function getBadgeselements(badges: CustomBadges, Badge: any, id: string) {
  const badgeTypes = [
    {
      condition: badges.customBadgesArray,
      element: (
        <Badge.customBadgesArray
          url={badges.customBadgesArray.badge}
          name={badges.customBadgesArray.name}
        />
      ),
    },
    { condition: badges.aliu.dev, element: <Badge.aliucordDeveloper /> },
    { condition: badges.aliu.contributor, element: <Badge.alucordContributors /> },
    { condition: badges.aliu.donor, element: <Badge.aliucordDonor /> },
    {
      condition: typeof badges.aliu.custom === "object" && badges.aliu.custom != null,
      element: <Badge.aliucordCustom url={badges.aliu.custom.url} name={badges.aliu.custom.text} />,
    },
    { condition: badges.bd.dev, element: <Badge.bdDevs /> },
    {
      condition: badges.enmity?.supporter,
      element: ( <Badge.enmityDevs url={badges.enmity?.supporter?.data.url.dark} name={badges.enmity?.supporter?.data.name} /> ),
    },
    {
      condition: badges.enmity?.staff,
      element: ( <Badge.enmityDevs url={badges.enmity?.staff?.data.url.dark} name={badges.enmity?.staff?.data.name} /> ),
    },
    {
      condition: badges.enmity?.dev,
      element: ( <Badge.enmityDevs url={badges.enmity?.dev?.data.url.dark} name={badges.enmity?.dev?.data.name} /> ),
    },
    {
      condition: badges.enmity?.contributor,
      element: ( <Badge.enmityDevs url={badges.enmity?.contributor?.data.url.dark} name={badges.enmity?.contributor?.data.name} /> ),
    },
    {
      // @ts-ignore
      condition: badges.enmity[id]?.data?.name,
      // @ts-ignore
      element: ( <Badge.enmityDevs url={badges.enmity[id]?.data?.url.dark} name={badges.enmity[id]?.data?.name} /> ),
    },
    { condition: badges.goosemod.dev, element: <Badge.gooseModDeveloper /> },
    { condition: badges.goosemod.sponsor, element: <Badge.gooseModSponsor /> },
    { condition: badges.goosemod.translator, element: <Badge.gooseModTranslator /> },
  ];

  return badgeTypes.filter(({ condition }) => condition).map(({ element }) => element);
}

export function stop(): void {
  inject.uninjectAll();
}
