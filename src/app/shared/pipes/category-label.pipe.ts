import { Pipe, PipeTransform } from '@angular/core';
import { SubscriptionCategory } from '@shared/models/domain.models';

const LABELS: Record<SubscriptionCategory, string> = {
  services: 'Сервисы',
  entertainment: 'Развлечения',
  utilities: 'Утилиты',
  education: 'Образование',
  other: 'Другое'
};

@Pipe({
  name: 'categoryLabel',
  standalone: true
})
export class CategoryLabelPipe implements PipeTransform {
  transform(value: SubscriptionCategory): string {
    return LABELS[value];
  }
}
