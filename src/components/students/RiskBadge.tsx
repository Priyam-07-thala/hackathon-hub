import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/lib/mlPredictor';

interface RiskBadgeProps {
  level: RiskLevel;
  showProbability?: boolean;
  probability?: number;
}

export function RiskBadge({ level, showProbability, probability }: RiskBadgeProps) {
  return (
    <Badge
      className={cn(
        'font-medium',
        level === 'Very Low' && 'risk-badge-very-low',
        level === 'Low' && 'risk-badge-low',
        level === 'Medium' && 'risk-badge-medium',
        level === 'High' && 'risk-badge-high'
      )}
    >
      {level} Risk {showProbability && probability !== undefined && `(${probability}%)`}
    </Badge>
  );
}
