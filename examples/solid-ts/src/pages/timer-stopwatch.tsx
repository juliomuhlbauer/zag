import { normalizeProps, useMachine } from "@zag-js/solid"
import * as timer from "@zag-js/timer"
import { StateVisualizer } from "../components/state-visualizer"
import { Toolbar } from "../components/toolbar"
import { createMemo, createUniqueId } from "solid-js"

export default function Page() {
  const [state, send] = useMachine(
    timer.machine({
      id: createUniqueId(),
      autoStart: true,
    }),
  )

  const api = createMemo(() => timer.connect(state, send, normalizeProps))

  return (
    <>
      <main class="timer">
        <div {...api().rootProps}>
          <div {...api().getSegmentProps({ type: "days" })}>{api().formattedTime.days}</div>
          <div {...api().separatorProps}>:</div>
          <div {...api().getSegmentProps({ type: "hours" })}>{api().formattedTime.hours}</div>
          <div {...api().separatorProps}>:</div>
          <div {...api().getSegmentProps({ type: "minutes" })}>{api().formattedTime.minutes}</div>
          <div {...api().separatorProps}>:</div>
          <div {...api().getSegmentProps({ type: "seconds" })}>{api().formattedTime.seconds}</div>
        </div>

        <div style={{ display: "flex", gap: "4px" }}>
          <button onClick={api().start}>START</button>
          <button onClick={api().pause}>PAUSE</button>
          <button onClick={api().resume}>RESUME</button>
          <button onClick={api().reset}>RESET</button>
        </div>
      </main>

      <Toolbar controls={null} viz>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
