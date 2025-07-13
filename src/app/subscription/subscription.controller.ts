import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { CurrentUser } from '../../shared-module/decorators/current-user.decorator';
import { Plan } from '../../shared-module/entities/plan.entity';
import { User } from '../../shared-module/entities/user.entity';
import { isProduction } from '../../shared-module/utils/helpers.util';
import { RenewSubscriptionDto, CreatePlanDto } from './dto/subscription.dto';
import { Subscription } from '../../shared-module/entities/subscription.entity';
import { SubscriptionService } from './subscription.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth()
@Controller('subscription')
@ApiTags('Subscription')
export class SubscriptionController {
constructor(private readonly subscriptionService: SubscriptionService) {}

@Get('plans')
@ApiOperation({ summary: 'Get all plans' })
async getPlans(@CurrentUser() user: User): Promise<Plan[]> {
return this.subscriptionService.getPlans(user);
}

@Post('plans')
@ApiOperation({ summary: 'Create a plan' })
async create(@Body() createPlanDto: CreatePlanDto): Promise<Plan> {
if (isProduction()) {
throw new NotFoundException();
}
return this.subscriptionService.createPlan(createPlanDto);
}

@Get('plans/user')
@ApiOperation({ summary: 'Get current user plan' })
async getCurrentSubscription(
@CurrentUser() user: User,
): Promise<Subscription | null> {
return this.subscriptionService.getCurrentSubscription(user);
}

@Post('plans/renew')
@ApiOperation({ summary: 'Renew user plan' })
async renewSubscription(
@Body() payload: RenewSubscriptionDto,
@CurrentUser() user: User,
): Promise<{ message: string }> {
return this.subscriptionService.renewSubscription(payload, user);
}


}
