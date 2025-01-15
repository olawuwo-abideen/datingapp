import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserStatus } from 'src/shared-module/entities/user.entity';
import { Not, Repository } from 'typeorm';
import { Match, MatchStatus } from 'src/shared-module/entities/match.entity';

@Injectable()
export class MatchService {
@InjectRepository(User)
private readonly userRepository: Repository<User>
@InjectRepository(Match)
private readonly matchRepository: Repository<Match>

async discoverMatches(user: User) {
if (!user.preferences) {
return {
message: 'No Match Found!',
}
}

const userPreferences = user.preferences;


const users = await this.userRepository.find({
where: {
id: Not(user.id), 
userstatus: UserStatus.ACTIVE, 
},
});

return users.filter((matchUser) => {
if (!matchUser.preferences) return false;

const isInterestMatch = matchUser.preferences.interestedIn.some(interest =>
userPreferences.interestedIn.includes(interest),
);

const isAgeRangeMatch =
matchUser.preferences.ageRange.min <= userPreferences.ageRange.max &&
matchUser.preferences.ageRange.max >= userPreferences.ageRange.min;

const isDistanceMatch = this.isWithinDistance(user.location, matchUser.location, userPreferences.distance);

return isInterestMatch && isAgeRangeMatch && isDistanceMatch;
});
}


private isWithinDistance(userLocation: { latitude: number; longitude: number }, matchUserLocation: { latitude: number; longitude: number }, maxDistance: number): boolean {
const distance = this.calculateDistance(userLocation.latitude, userLocation.longitude, matchUserLocation.latitude, matchUserLocation.longitude);
return distance <= maxDistance;
}


private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
const toRadians = (degrees: number) => degrees * Math.PI / 180;

const R = 6371; 
const dLat = toRadians(lat2 - lat1);
const dLon = toRadians(lon2 - lon1);

const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
Math.sin(dLon / 2) * Math.sin(dLon / 2);

const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return R * c; // Distance in km
}



async sendMatchRequest(sender: User, id: string): Promise<Match> {
const receiver = await this.userRepository.findOne(
{ where: { id } }

);

if (!receiver) {
throw new NotFoundException('User not found.');

}

// Check if sender and receiver are the same (optional check)
if (sender.id === receiver.id) {
throw new Error('Cannot send match request to yourself');
}

// Create a new match object
const match = new Match();
match.sender = sender;
match.receiver = receiver;
match.status = MatchStatus.PENDING;

// Save the match request to the database
return this.matchRepository.save(match);
}


async updateMatchStatus(user: User, id: string, status: string): Promise<Match> {
// Fetch the match request by matchId
const match = await this.matchRepository.findOne(
{ where: { id } }
);
if (!match) {
throw new NotFoundException('Match request not found');

}

if (match.sender.id !== user.id && match.receiver.id !== user.id) {
throw new Error('You are not authorized to update this match status');
}

if (!Object.values(MatchStatus).includes(status as MatchStatus)) {
throw new Error('Invalid match status');
}

match.status = status as MatchStatus;

return this.matchRepository.save(match);
}






}
