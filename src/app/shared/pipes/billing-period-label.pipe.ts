import { Pipe, PipeTransform } from '@angular/core';
import { BillingPeriod } from '@shared/models/domain.models';

const LABELS: Record<BillingPeriod, string> = {
  daily: 'Ежедневно',
  weekly: 'Еженедельно',
  monthly: 'Ежемесячно',
  yearly: 'Ежегодно'
};

@Pipe({
  name: 'billingPeriodLabel',
  standalone: true
})
export class BillingPeriodLabelPipe implements PipeTransform {
  transform(value: BillingPeriod): string {
    return LABELS[value];
  }
}
