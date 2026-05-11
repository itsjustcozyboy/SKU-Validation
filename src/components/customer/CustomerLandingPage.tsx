import Landing from '../Landing';

interface Props {
  onStart: () => void;
  onLoadSample: () => void;
}

export default function CustomerLandingPage({ onStart, onLoadSample }: Props) {
  return <Landing onStart={onStart} onLoadSample={onLoadSample} />;
}
