import { Navigate } from "@solidjs/router";
import { Route, Router } from "@solidjs/router";
import { type JSX, Show, createResource } from "solid-js";
import { Dynamic } from "solid-js/web";
import { NavTopConfig1 } from "./NavTop";
import { ContextState, contextState } from "./context_state";
import { queryDatabases, queryInstances } from "./http";
import { PageActivity } from "./page/activity";
import { PageMetric } from "./page/metric";
import { DarkmodeSelector } from "./view/darkmode";
import { InstanceHeader } from "./view/instance_header";
import { TimebarSection } from "./view/timebar_section";

export default function App(): JSX.Element {
  return (
    <ContextState>
      <Router root={Layout}>
        <Route path="/" component={() => <Navigate href="/activity" />} />
        <Route
          path="/activity"
          component={() => PageWrapper("pageActivity", PageActivity)}
        />
        <Route
          path="/metrics"
          component={() => PageWrapper("pageMetric", PageMetric)}
        />
        <Route path={"**"} component={() => <h1>404. Page not found.</h1>} />
      </Router>
    </ContextState>
  );
}

function Layout(props: {
  children?:
    | number
    | boolean
    | Node
    | JSX.ArrayElement
    | (string & {})
    | null
    | undefined;
}): JSX.Element {
  const [instances] = createResource(() => queryInstances(true));
  createResource(instances, () => queryDatabases(true));

  return <div class="max-w-screen-xl mx-auto">{props.children}</div>;
}

function PageWrapper(testid: string, page: () => JSX.Element) {
  const { state } = contextState();
  return (
    <>
      <section data-testid={testid} class="flex flex-col mx-1 xs:mx-8">
        <NavTopConfig1 />
        <InstanceHeader class="mb-8" />
        <Show when={state.database_list.length}>
          <Dynamic component={page} />
          <section class="sticky bottom-0 flex flex-col mt-3 pt-1 z-20 backdrop-blur">
            <TimebarSection />
          </section>
        </Show>
      </section>
      <DarkmodeSelector class="mt-16 mb-4 self-start" />
    </>
  );
}
