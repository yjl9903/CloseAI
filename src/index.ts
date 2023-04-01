import useReflare from 'reflare';

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
}

const OPENAI_API_HOST = 'api.openai.com';

export default {
  async fetch(
    request: Request,
    _env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/') {
      return new Response(
        '[CloseAI](https://github.com/yjl9903/CloseAI) is an OpenAI proxy cloudflare worker.',
        {
          headers: {
            'content-type': 'text/plain;charset=UTF-8',
          },
        }
      );
    } else if (await checkLocationInfo()) {
      const reflare = await useReflare();

      reflare.push({
        path: '/*',
        upstream: {
          domain: OPENAI_API_HOST,
          protocol: 'https',
        },
      });

      return reflare.handle(request);
    } else {
      return new Response('Worker Internal Error', {
        status: 500,
        headers: {
          'content-type': 'text/plain;charset=UTF-8',
        },
      });
    }
  },
};

let Location: string | undefined = undefined;
let LocationValid: boolean | undefined = undefined;
async function checkLocationInfo() {
  if (LocationValid === true) {
    return true;
  } else if (LocationValid === false) {
    return false;
  }

  function parseResponse(response: string): OpenAICDNCGITraceResponse {
    const params: Record<string, string> = {};
    const pairs = response.split('\n');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      if (key && value) {
        params[key.trim()] = value.trim();
      }
    }
    return params as unknown as OpenAICDNCGITraceResponse;
  }

  // API endpoint of OpenAI's CDN that returns location information. No authentication needed.
  const code = await fetch('https://chat.openai.com/cdn-cgi/trace', {
    headers: { 'Cache-Control': 'no-store' },
  })
    .then(response => response.text())
    .then(parseResponse)
    .then(o => o.loc || '')
    .catch(() => '');

  Location = code;
  return (LocationValid = ALLOWED_COUNTRY_CODES.has(code));
}

interface OpenAICDNCGITraceResponse {
  fl: string;
  h: string;
  ip: string;
  ts: string;
  visit_scheme: string;
  uag: string;
  colo: string;
  sliver: string;
  http: string;
  loc: string;
  tls: string;
  sni: string;
  warp: string;
  gateway: string;
  rbi: string;
  kex: string;
}

const ALLOWED_COUNTRY_CODES = new Set([
  'AL',
  'DZ',
  'AD',
  'AO',
  'AG',
  'AR',
  'AM',
  'AU',
  'AT',
  'AZ',
  'BS',
  'BD',
  'BB',
  'BE',
  'BZ',
  'BJ',
  'BT',
  'BO',
  'BA',
  'BW',
  'BR',
  'BN',
  'BG',
  'BF',
  'CV',
  'CA',
  'CL',
  'CO',
  'KM',
  'CG',
  'CR',
  'CI',
  'HR',
  'CY',
  'CZ',
  'DK',
  'DJ',
  'DM',
  'DO',
  'EC',
  'SV',
  'EE',
  'FJ',
  'FI',
  'FR',
  'GA',
  'GM',
  'GE',
  'DE',
  'GH',
  'GR',
  'GD',
  'GT',
  'GN',
  'GW',
  'GY',
  'HT',
  'VA',
  'HN',
  'HU',
  'IS',
  'IN',
  'ID',
  'IQ',
  'IE',
  'IL',
  'IT',
  'JM',
  'JP',
  'JO',
  'KZ',
  'KE',
  'KI',
  'KW',
  'KG',
  'LV',
  'LB',
  'LS',
  'LR',
  'LI',
  'LT',
  'LU',
  'MG',
  'MW',
  'MY',
  'MV',
  'ML',
  'MT',
  'MH',
  'MR',
  'MU',
  'MX',
  'FM',
  'MD',
  'MC',
  'MN',
  'ME',
  'MA',
  'MZ',
  'MM',
  'NA',
  'NR',
  'NP',
  'NL',
  'NZ',
  'NI',
  'NE',
  'NG',
  'MK',
  'NO',
  'OM',
  'PK',
  'PW',
  'PS',
  'PA',
  'PG',
  'PE',
  'PH',
  'PL',
  'PT',
  'QA',
  'RO',
  'RW',
  'KN',
  'LC',
  'VC',
  'WS',
  'SM',
  'ST',
  'SN',
  'RS',
  'SC',
  'SL',
  'SG',
  'SK',
  'SI',
  'SB',
  'ZA',
  'KR',
  'ES',
  'LK',
  'SR',
  'SE',
  'CH',
  'TW',
  'TZ',
  'TH',
  'TL',
  'TG',
  'TO',
  'TT',
  'TN',
  'TR',
  'TV',
  'UG',
  'UA',
  'AE',
  'GB',
  'US',
  'UY',
  'VU',
  'ZM',
]);
