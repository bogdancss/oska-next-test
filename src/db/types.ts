export interface PersistenceColumns {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
}

export type Unpersisted<T> = Omit<T, keyof PersistenceColumns>;

export interface BloodPressureReading extends PersistenceColumns {
  userId: number;
  systolic: number;
  diastolic: number;
}
