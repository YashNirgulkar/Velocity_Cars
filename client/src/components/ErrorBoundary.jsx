import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-obsidian px-6 py-24 text-platinum">
          <div className="mx-auto max-w-3xl border border-ember/40 bg-carbon/80 p-8">
            <p className="font-display text-6xl text-ember">SYSTEM FAULT</p>
            <p className="mt-4 text-xl text-platinum/70">A rendering error occurred. Refresh the cockpit to restart the experience.</p>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
