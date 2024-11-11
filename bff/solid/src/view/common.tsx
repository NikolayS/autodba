import type { JSX } from "solid-js";

export function DebugJson(props: {
  json: /*eslint-disable */ any /*eslint-enable */;
}) {
  return (
    <pre class="break-words max-w-96 overflow-auto">
      {JSON.stringify(props.json, null, 2)}
    </pre>
  );
}

export function ViewTitle(props: {
  title:
    | number
    | boolean
    | Node
    | JSX.ArrayElement
    | (string & {})
    | null
    | undefined;
}) {
  return (
    <span class="font-medium dark:font-base sm:font-base sm:text-sm/6 leading-6">
      {props.title}
    </span>
  );
}
