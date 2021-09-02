/* import { MessageBus } from '.';

const messageBus = MessageBus.getInstance();

messageBus.$emit('frontend', 'tips', 'a');
messageBus.$emit('frontend', 'tips', 'b');
messageBus.$emit('frontend', 'tips', 'c');

messageBus.$on('frontend', 'tips').subscribe((data: any) => {
  console.log(1, data);
});

messageBus.$emit('frontend', 'tips', 'd', { persist: true });

const messageBus2 = MessageBus.getInstance();

messageBus2.$on('frontend', 'tips').subscribe((data: any) => {
  console.log(2, data);
});

messageBus2.$emit('frontend', 'tips', 'e');

console.log(3, messageBus.getValues('frontend', 'tips'));

console.log(4, messageBus.getValue('frontend', 'tips'));
 */
