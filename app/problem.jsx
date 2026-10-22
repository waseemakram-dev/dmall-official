import { serviceOverviews } from './content/services-overview';
import ServicesOverview from './services-overview';

export default function Problem() {
  return <ServicesOverview content={serviceOverviews.problem} variant="problem" />;
}
