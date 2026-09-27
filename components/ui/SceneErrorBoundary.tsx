import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onFallback: () => void;
};

type State = { failed: boolean };

export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unable to start the 3D portfolio", error, info.componentStack);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="scene-error" role="alert">
          <p>This device could not start the 3D room.</p>
          <button type="button" onClick={this.props.onFallback}>Open the readable portfolio</button>
        </div>
      );
    }

    return this.props.children;
  }
}
