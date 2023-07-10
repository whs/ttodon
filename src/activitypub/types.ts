/**
 * @link https://www.w3.org/TR/activitystreams-core/#object
 */
export interface ASObject<Type = string> {
	"@context"?: "https://www.w3.org/ns/activitystreams" | ["https://www.w3.org/ns/activitystreams"] | [
		"https://www.w3.org/ns/activitystreams",
		Record<string, any>,
	],
	id?: string,
	type?: Type,
	attachment?: ObjectOrLink[],
	attributedTo?: ObjectOrLink,
	audience?: ObjectOrLink,
	content?: string,
	context?: ObjectOrLink,
	name?: string,
	endTime?: DateTime,
	generator?: ObjectOrLink,
	icon?: ASLink | ASObject<"Image">,
	image?: ASLink | ASObject<"Image">,
	inReplyTo?: ObjectOrLink,
	location?: ObjectOrLink,
	preview?: ObjectOrLink,
	published?: DateTime,
	replies?: Collection,
	startTime?: DateTime,
	summary?: string,
	tag?: ObjectOrLink[],
	updated?: DateTime,
	url?: string | ASLink,
	to?: ObjectOrLink[],
	bto?: ObjectOrLink[],
	cc?: ObjectOrLink[],
	bcc?: ObjectOrLink[],
	mediaType?: string,
	duration?: string,

	[key: string]: any,
}

/**
 * @link https://www.w3.org/TR/activitystreams-core/#link
 */
interface _ASLink {
	"@context"?: "https://www.w3.org/ns/activitystreams",
	type: "Link",
	href: string,
	rel?: string[],
	mediaType?: string,
	name?: string,
	hreflang?: string,
	height?: number,
	width?: number,
	preview?: ObjectOrLink,

	[key: string]: any,
}

export type ASLink = _ASLink | string;

export type ObjectOrLink<T = string> = ASObject<T> | ASLink;
export type DateTime = string;

/**
 * @link https://www.w3.org/TR/activitystreams-core/#collections
 */
export interface Collection<ItemType = string, T = "Collection"> extends ASObject<T> {
	items?: ObjectOrLink<ItemType> | ObjectOrLink<ItemType>[],
	totalItems?: number,
	first?: ASLink|CollectionPage<ItemType>,
	last?: ASLink|CollectionPage<ItemType>,
	current?: ASLink|CollectionPage<ItemType>,
}

export interface OrderedCollection<ItemType = string> extends Collection<ItemType, "OrderedCollection"> {
}

export interface CollectionPage<ItemType = string> extends Collection<ItemType, "CollectionPage"> {
	partOf?: ASLink | Collection<ItemType>,
	next?: ASLink | CollectionPage<ItemType>,
	prev?: ASLink | CollectionPage<ItemType>,
}

export interface Activity<ActorType = string, ObjectType = string, TargetType = string, ResultType = string, OriginType = string, InstrumentType = string, ActivityType = "Activity"> extends ASObject<ActivityType> {
	actor: ObjectOrLink<ActorType> | ObjectOrLink<ActorType>[],
	object: ASObject<ObjectType>,
	target?: ObjectOrLink<TargetType>,
	result?: ObjectOrLink<ResultType>,
	origin?: ObjectOrLink<OriginType>,
	instrument: ObjectOrLink<InstrumentType> | ObjectOrLink<InstrumentType>[],
}

export interface IntransitiveActivity<ActorType = string, ObjectType = string, TargetType = string, ResultType = string, OriginType = string, InstrumentType = string, ActivityType = "IntransitiveActivity"> extends Omit<Activity<ActorType, ObjectType, TargetType, ResultType, OriginType, InstrumentType, ActivityType>, "object"> {
}

/**
 * Note is represented in Mastodon as a status
 *
 * @link https://www.w3.org/ns/activitystreams#Note
 */
export interface Note extends ASObject<"Note"> {
}

/**
 * Question is represented in Mastodon as a poll
 *
 * @link https://www.w3.org/ns/activitystreams#Question
 */
export interface Question<QuestionType = ObjectOrLink, ActorType = string, ObjectType = string, TargetType = string, ResultType = string, OriginType = string, InstrumentType = string> extends IntransitiveActivity<ActorType, ObjectType, TargetType, ResultType, OriginType, InstrumentType, "Question"> {
	oneOf?: QuestionType[],
	anyOf?: QuestionType[],
	closed?: boolean | DateTime | ObjectOrLink,
}

/**
 * Activities can be addressed to this public connection to make it public
 * @link https://www.w3.org/TR/activitypub/#public-addressing
 */
export const PUBLIC_COLLECTION = "https://www.w3.org/ns/activitystreams#Public";
