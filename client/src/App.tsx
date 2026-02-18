import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PlayerProvider } from "./contexts/PlayerContext";
import { AudioProvider } from "./contexts/AudioContext";
import Home from "./pages/Home";
import ExponentialExplorer from "./pages/ExponentialExplorer";
import LogDetective from "./pages/LogDetective";
import CompoundInterest from "./pages/CompoundInterest";
import ViralVideo from "./pages/ViralVideo";
import CarbonDating from "./pages/CarbonDating";
import LogLaws from "./pages/LogLaws";
import LogEvaluation from "./pages/LogEvaluation";
import EquationSolver from "./pages/EquationSolver";
import GraphMatcher from "./pages/GraphMatcher";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/activity/exponential-explorer"} component={ExponentialExplorer} />
      <Route path={"/activity/log-detective"} component={LogDetective} />
      <Route path={"/activity/compound-interest"} component={CompoundInterest} />
      <Route path="/activity/viral-video" component={ViralVideo} />
      <Route path="/activity/carbon-dating" component={CarbonDating} />
      <Route path="/activity/log-laws" component={LogLaws} />
      <Route path="/activity/log-evaluation" component={LogEvaluation} />
      <Route path="/activity/equation-solver" component={EquationSolver} />
      <Route path="/activity/graph-matcher" component={GraphMatcher} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AudioProvider>
        <PlayerProvider>
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster position="top-center" />
              <Router />
            </TooltipProvider>
          </ThemeProvider>
        </PlayerProvider>
      </AudioProvider>
    </ErrorBoundary>
  );
}

export default App;
