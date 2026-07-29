import type { Tables, TablesInsert, TablesUpdate } from './database.types'

export type Trip = Tables<'rumo_trips'>
export type TripInsert = TablesInsert<'rumo_trips'>
export type TripUpdate = TablesUpdate<'rumo_trips'>

export type TripMember = Tables<'rumo_trip_members'>
export type TripMemberInsert = TablesInsert<'rumo_trip_members'>

export type Expense = Tables<'rumo_expenses'>
export type ExpenseInsert = TablesInsert<'rumo_expenses'>

export type ExpenseSplit = Tables<'rumo_expense_splits'>
export type ExpenseSplitInsert = TablesInsert<'rumo_expense_splits'>

export type Profile = Tables<'rumo_profiles'>

export type BudgetItem = Tables<'rumo_budget_items'>
export type BudgetItemInsert = TablesInsert<'rumo_budget_items'>

export type BudgetCategory = Tables<'rumo_budget_categories'>
export type BudgetCategoryInsert = TablesInsert<'rumo_budget_categories'>

export type ItineraryDay = Tables<'rumo_itinerary_days'>
export type ItineraryDayInsert = TablesInsert<'rumo_itinerary_days'>
export type ItineraryDayUpdate = TablesUpdate<'rumo_itinerary_days'>

export type PlanningCategory = Tables<'rumo_planning_categories'>
export type PlanningCategoryInsert = TablesInsert<'rumo_planning_categories'>

export type PlanningOption = Tables<'rumo_planning_options'>
export type PlanningOptionInsert = TablesInsert<'rumo_planning_options'>
export type PlanningOptionUpdate = TablesUpdate<'rumo_planning_options'>

export type ChecklistItem = Tables<'rumo_checklist_items'>
export type ChecklistItemInsert = TablesInsert<'rumo_checklist_items'>

export type PriceWatch = Tables<'rumo_price_watches'>
export type PriceWatchInsert = TablesInsert<'rumo_price_watches'>

export type PriceObservation = Tables<'rumo_price_observations'>
export type PriceObservationInsert = TablesInsert<'rumo_price_observations'>
