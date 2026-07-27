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

export type ItineraryDay = Tables<'rumo_itinerary_days'>
export type ItineraryDayInsert = TablesInsert<'rumo_itinerary_days'>
