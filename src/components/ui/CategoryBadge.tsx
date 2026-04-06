import { Category, CATEGORY_BG } from '@/types/expense';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

export default function CategoryBadge({ category, size = 'md' }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${CATEGORY_BG[category]} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {category}
    </span>
  );
}
