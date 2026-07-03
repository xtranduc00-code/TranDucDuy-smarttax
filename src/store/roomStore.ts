import { createEntityStore } from './createEntityStore';
import type { Room } from '../types/room';
import { seedRooms } from './seedData';

export const useRoomStore = createEntityStore<Room>('hr-rooms', seedRooms);
