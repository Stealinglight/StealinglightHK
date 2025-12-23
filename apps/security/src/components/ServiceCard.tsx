import { Link } from 'react-router-dom';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
}

/**
 * Service offering card
 */
export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="service-card">
      <div className="service-card-icon">{service.icon}</div>
      <h3 className="service-card-title">{service.title}</h3>
      <p className="service-card-description">{service.description}</p>
      <ul className="service-card-features">
        {service.features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      {service.cta && (
        <Link to="/contact" className="service-card-cta">
          {service.cta}
        </Link>
      )}
    </div>
  );
}
