// ============================================
// UI COMPONENT TYPES
// ============================================

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'ghost' | 'outline';
export type ButtonType = 'button' | 'submit' | 'reset';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'date' | 'time' | 'datetime-local';
export type Position = 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

// ===== BUTTON =====
export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
}

// ===== INPUT =====
export interface InputProps {
  modelValue?: string | number;
  type?: InputType;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  size?: Size;
  clearable?: boolean;
}

// ===== SELECT =====
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface SelectProps {
  modelValue?: string | number | string[] | number[];
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  hint?: string;
  searchable?: boolean;
  multiple?: boolean;
  size?: Size;
  clearable?: boolean;
}

// ===== CHECKBOX & RADIO =====
export interface CheckboxProps {
  modelValue?: boolean | any[];
  label?: string;
  value?: any;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: Size;
}

export interface RadioProps {
  modelValue?: any;
  value: any;
  label?: string;
  disabled?: boolean;
  size?: Size;
}

// ===== CARD =====
export interface CardProps {
  variant?: 'default' | 'glass' | 'neumorphic' | 'elevated';
  padding?: Size;
  hoverable?: boolean;
  clickable?: boolean;
  loading?: boolean;
}

// ===== MODAL =====
export interface ModalProps {
  modelValue: boolean;
  title?: string;
  size?: Size;
  persistent?: boolean;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  fullscreen?: boolean;
}

// ===== TOAST/NOTIFICATION =====
export interface ToastOptions {
  id?: string;
  title?: string;
  message: string;
  variant?: Variant;
  duration?: number;
  position?: Position;
  closeable?: boolean;
  icon?: string;
}

export interface Toast extends ToastOptions {
  id: string;
  createdAt: number;
}

// ===== PROGRESS =====
export interface ProgressProps {
  value: number;
  max?: number;
  variant?: Variant;
  size?: Size;
  showLabel?: boolean;
  indeterminate?: boolean;
  circular?: boolean;
}

// ===== TABLE =====
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any, row: any) => string;
}

export interface TableProps {
  columns: TableColumn[];
  data: any[];
  loading?: boolean;
  selectable?: boolean;
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  pagination?: boolean;
  pageSize?: number;
  currentPage?: number;
  totalItems?: number;
}

export interface TableSort {
  key: string;
  order: 'asc' | 'desc';
}

// ===== BREADCRUMB =====
export interface BreadcrumbItem {
  label: string;
  to?: string | { name: string; params?: any };
  icon?: string;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: string;
}

// ===== BADGE =====
export interface BadgeProps {
  variant?: Variant;
  size?: Size;
  rounded?: boolean;
  dot?: boolean;
}

// ===== AVATAR =====
export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: Size;
  initials?: string;
  variant?: Variant;
  shape?: 'circle' | 'square' | 'rounded';
}

// ===== TABS =====
export interface TabItem {
  key: string;
  label: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps {
  modelValue: string;
  items: TabItem[];
  variant?: 'default' | 'pills' | 'underline';
  align?: 'left' | 'center' | 'right';
}

// ===== DROPDOWN =====
export interface DropdownItem {
  label: string;
  value?: any;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  items: DropdownItem[];
  position?: Position;
  trigger?: 'click' | 'hover';
  disabled?: boolean;
}

// ===== TOOLTIP =====
export interface TooltipProps {
  content: string;
  position?: Position;
  delay?: number;
  disabled?: boolean;
}

// ===== PAGINATION =====
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  totalItems?: number;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  showTotal?: boolean;
}

// ===== FILE UPLOAD =====
export interface FileUploadProps {
  modelValue?: File | File[];
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  disabled?: boolean;
  dragDrop?: boolean;
  showPreview?: boolean;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  progress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

// ===== SIDEBAR/NAVIGATION =====
export interface NavItem {
  label: string;
  to?: string | { name: string; params?: any };
  icon?: string;
  badge?: string | number;
  badgeVariant?: Variant;
  children?: NavItem[];
  disabled?: boolean;
  divider?: boolean;
}

export interface SidebarProps {
  items: NavItem[];
  collapsed?: boolean;
  collapsible?: boolean;
  width?: string;
  mobileBreakpoint?: number;
}

// ===== CHART =====
export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'polarArea';
  data: ChartData;
  options?: any;
  height?: string;
  responsive?: boolean;
}

// ===== STATS CARD =====
export interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: string;
  iconVariant?: Variant;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  loading?: boolean;
}

// ===== COURSE/LESSON SPECIFIC =====
export interface CourseCardProps {
  id: string | number;
  title: string;
  description?: string;
  thumbnail?: string;
  progress?: number;
  instructor?: string;
  duration?: string;
  lessons?: number;
  rating?: number;
  students?: number;
  price?: number;
  isFree?: boolean;
  tags?: string[];
  variant?: 'default' | 'compact' | 'detailed';
}

export interface LessonCardProps {
  id: string | number;
  title: string;
  description?: string;
  duration?: string;
  completed?: boolean;
  locked?: boolean;
  type?: 'video' | 'text' | 'quiz' | 'assignment';
  order?: number;
}

// ===== LOADING STATES =====
export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string;
  height?: string;
  animation?: 'pulse' | 'wave' | 'none';
}

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}
