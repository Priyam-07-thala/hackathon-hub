import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  showProbability?: boolean;
  probability?: number;
}

export function RiskBadge({ level, showProbability, probability }: RiskBadgeProps) {
  return (
    <Badge
      className={cn(
        'font-medium',
        level === 'Low' && 'risk-badge-low',
        level === 'Medium' && 'risk-badge-medium',
        level === 'High' && 'risk-badge-high'
      )}
    >
      {level} Risk {showProbability && probability !== undefined && `(${probability}%)`}
    </Badge>
  );
}
