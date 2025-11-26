import torch
import torch.nn as nn

class ResNet(nn.Module):

    def __init__(self, height, width, depth, filters, policy_output_dim, reg=0.0001, bn_eps=2e-5, bn_mom=0.9, num_res_blocks=2, use_bias=True):
        super(ResNet, self).__init__()

        self.height = height
        self.width = width
        self.depth = depth
        self.filters = filters
        self.policy_output_dim = policy_output_dim
        self.reg = reg
        self.bn_eps = bn_eps
        self.bn_mom = bn_mom
        self.num_res_blocks = num_res_blocks
        self.use_bias = use_bias
        self.relu = nn.ReLU()

        self.stem_conv = nn.Conv2d(in_channels=depth, out_channels=filters, kernel_size=3, stride=1, padding=1, bias=use_bias)
        self.stem_bn = nn.BatchNorm2d(num_features=filters, eps=bn_eps, momentum=1 - bn_mom)

        self.res_blocks = nn.ModuleList([self.make_residual_block(filters, filters) for _ in range(num_res_blocks)])

        self.policy_conv = nn.Conv2d(in_channels=filters, out_channels=32, kernel_size=3, stride=1,padding=1, bias=use_bias)
        self.policy_bn = nn.BatchNorm2d(num_features=32,eps=bn_eps, momentum= 1 - bn_mom)
        self.policy_flatten_size = 32 * height * width
        self.policy_dense = nn.Linear(self.policy_flatten_size, policy_output_dim)

        self.value_conv = nn.Conv2d(in_channels=filters, out_channels=32, kernel_size=1, stride=1, padding=0, bias=use_bias)
        self.value_bn = nn.BatchNorm2d(num_features=32, eps=bn_eps, momentum=1 - bn_mom)
        self.value_flatten_size = 32 * height * width
        self.value_dense1 = nn.Linear(self.value_flatten_size, 256)
        self.value_dense2 = nn.Linear(256,1)

        self._init_weights()

    def make_residual_block(self, in_channels, out_channels):

        return nn.Sequential(
            nn.Conv2d(in_channels=in_channels, out_channels=out_channels, kernel_size=3, stride=1, padding=1, bias=self.use_bias),
            nn.BatchNorm2d(num_features=out_channels,eps=self.bn_eps, momentum=1 - self.bn_mom),
            self.relu,
            nn.Conv2d(in_channels=out_channels, out_channels=out_channels, kernel_size=3, stride=1, padding=1, bias=self.use_bias),
            nn.BatchNorm2d(num_features=out_channels,eps=self.bn_eps,momentum=1 - self.bn_mom)
        )

    def _init_weights(self):
        """
        Might not be needed but saw someone doing this because torch weight init uses kaiming uniform init for conv2d
        """
        stddev = 0.05

        for module in self.modules():
            if isinstance(module, (nn.Conv2d, nn.Linear)):
                nn.init.trunc_normal_(module.weight, std=stddev)
                if module.bias is not None:
                    nn.init.zeros_(module.bias)

    def forward(self, x):
        x = self.stem_conv(x)
        x = self.stem_bn(x)
        x = self.relu(x)

        for res_block in self.res_blocks:
            residual = x
            x = res_block(x)
            x = x + residual
            x = self.relu(x)

        policy = self.policy_conv(x)
        policy = self.policy_bn(policy)
        policy = self.relu(policy)
        policy = policy.reshape(policy.size(0), -1)
        policy = self.policy_dense(policy)

        value = self.value_conv(x)
        value = self.value_bn(value)
        value = self.relu(value)
        value = value.reshape(value.size(0), -1)
        value = self.value_dense1(value)
        value = self.relu(value)
        value = self.value_dense2(value)
        value = torch.tanh(value)
        return [policy, value]