// Подключаем модули
import 'dotenv/config';
import { Telegraf } from 'telegraf';
import addUser from './db/addUser.js';

const botToken = process.env.BOT_TOKEN;
const adminId = process.env.ADMIN_ID;

// Создаем объект бота
const bot = new Telegraf(botToken);

// Текстовые настройки
const replyText = {
	adminGreeting: 'Привет! Ожидаю сообщения от пользователей',
	userGreeting:
		'Привет! Отправь мне сообщение. Постараюсь ответить в ближайшее время.',
	replyWrong: 'Для ответа пользователю используй функцию Ответить.',
};

// Проверяем пользователя на права
const isAdmin = userId => userId === parseInt(adminId);

// Перенаправляем админу от пользователя или уведомляем админа об ошибке
const forwardToAdmin = ctx => {
	if (isAdmin(ctx.message.from.id)) {
		ctx.reply(replyText.replyWrong);
	} else {
		ctx.forwardMessage(adminId, ctx.from.id, ctx.message.id);
	}
};

// Старт бота
bot.start(ctx => {
	// Добавляем пользователя
	addUser(ctx.message.from);

	// Отвечаем пользователю
	ctx.reply(
		isAdmin(ctx.message.from.id)
			? replyText.adminGreeting
			: replyText.userGreeting
	);
});

// Слушаем на наличие объекта message
bot.on('message', ctx => {
	// Убеждаемся что это админ ответил на сообщение пользователя
	if (
		ctx.message.reply_to_message &&
		ctx.message.reply_to_message.forward_from &&
		isAdmin(ctx.message.from.id)
	) {
		// Отправляем копию пользователю
		ctx.telegram.copyMessage(
			ctx.message.reply_to_message.forward_from.id,
			ctx.message.chat.id,
			ctx.message.message_id
		);
	} else {
		// Отправляем админу
		forwardToAdmin(ctx);
	}
});

// Запускаем бот
bot.launch();
