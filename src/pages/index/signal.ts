import EventEmitter from '@/utils/EventEmitter';

const signal = new EventEmitter<'getUserData'>();

export default signal;
