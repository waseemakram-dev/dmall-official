import { serviceOverviews } from './content/services-overview';
import ServicesOverview from './services-overview';

export default function Solution() {
  return <ServicesOverview content={serviceOverviews.solution} variant="solution" />;
}
